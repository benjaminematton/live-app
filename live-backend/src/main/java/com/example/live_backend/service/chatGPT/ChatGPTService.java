package com.example.live_backend.service.chatGPT;

import com.example.live_backend.dto.Activity.ActivityResponse;
import com.example.live_backend.model.Activity.Activity;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.theokanning.openai.completion.chat.ChatMessage;
import com.theokanning.openai.completion.chat.ChatCompletionRequest;
import com.theokanning.openai.service.OpenAiService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatGPTService {

    private final OpenAiService openAiService;
    private final ObjectMapper objectMapper;

    @Value("${openai.model}")
    private String model;

    /**
     * In-memory conversation history for demonstration.
     * In production, consider storing in a DB or session cache keyed by user/session ID.
     */
    private final List<ChatMessage> conversation = new ArrayList<>();

    /**
     * Generates schedule suggestions based on the user's prompt, location, and optional start/end times.
     * It appends to the conversation so ChatGPT sees prior context if the user calls again.
     */
    public List<ActivityResponse> generateActivitiesSuggestions(
            String prompt,
            LocalDateTime startDate,
            LocalDateTime endDate,
            String location
    ) {
        try {
            // If this is the first call in the conversation, we add a system message
            if (conversation.isEmpty()) {
                String systemPrompt = buildInitialSystemPrompt(prompt, location, startDate, endDate);
                conversation.add(new ChatMessage("system", systemPrompt));
            }

            // Add the user's latest prompt as a user message
            String userMessageContent = prompt;
            if (startDate != null && endDate != null) {
                userMessageContent += "\n(Activities should be between "
                        + startDate + " and " + endDate + ")";
            }
            conversation.add(new ChatMessage("user", userMessageContent));

            // Send to OpenAI and parse response
            String response = sendChatCompletionRequest(conversation);
            return parseActivities(response);

        } catch (Exception e) {
            throw new RuntimeException("Failed to generate schedule suggestions", e);
        }
    }

    /**
     * Allows the user to refine the *existing* schedule. We pass the current schedule JSON
     * and a refinement prompt, then ChatGPT returns an updated schedule. 
     * This also appends to the same conversation for context.
     */
    public List<ActivityResponse> refineExperience(
            List<Activity> currentActivities,
            String refinementPrompt
    ) {
        try {
            // Convert current schedule to JSON
            String currentScheduleJson = objectMapper.writeValueAsString(currentActivities);

            // We add a system message so ChatGPT knows how to handle refinement
            String refinementSystemPrompt = """
                You are an assistant that refines schedules.
                You receive the user's current schedule as a JSON array of activities, plus a refinement request.
                Return only the updated schedule in valid JSON, preserving the same structure and keys:
                [title, description, location, startTime, endTime].
                
                If the user wants changes—like editing times, removing or adding activities—apply them.
                Do not include any extra commentary, keys, or code blocks.
                Output must be a JSON array of objects, each with exactly the five keys listed.
                No other text outside of the JSON array.
            """;
            // We add or replace the system message for refinement (optional approach).
            // If you want to *append* to the existing conversation while changing instructions, 
            // you can add another system message. 
            // Alternatively, if you'd rather keep the first system message, remove this step.
            conversation.add(new ChatMessage("system", refinementSystemPrompt));

            // Build a user message referencing the existing schedule
            String userMessageContent = "Current schedule: " + currentScheduleJson
                    + "\n\nRefinement request: " + refinementPrompt;
            conversation.add(new ChatMessage("user", userMessageContent));

            // Send request
            String response = sendChatCompletionRequest(conversation);
            return parseActivities(response);

        } catch (Exception e) {
            throw new RuntimeException("Failed to refine schedule", e);
        }
    }

    /**
     * Recommends follow-up activities based on a chosen activity.
     * Also appends to the conversation so ChatGPT is aware of the prior context.
     */
    public List<ActivityResponse> recommendActivities(String chosenActivity) {
        try {
            // Create a user message referencing the chosen activity
            String userMessageContent = "The user has chosen: " + chosenActivity
                    + ". Suggest 3 follow-up activities that pair well with it.";
            conversation.add(new ChatMessage("user", userMessageContent));

            String response = sendChatCompletionRequest(conversation);
            return parseActivities(response);

        } catch (Exception e) {
            throw new RuntimeException("Failed to generate activity recommendations", e);
        }
    }

    /**
     * Helper to create the system prompt for the initial schedule generation.
     */
    private String buildInitialSystemPrompt(
            String userPrompt,
            String location,
            LocalDateTime startDate,
            LocalDateTime endDate
    ) {
        String systemPrompt = """
        You are an assistant that MUST reply with **only** a JSON array (`[...]`) and nothing else.

        Each element MUST match this schema exactly:
        {
        "title"      : "<real venue / event name>",
        "description": "<one-sentence summary (≤120 chars)>",
        "location"   : "<address>",
        "startTime"  : "<ISO-8601 local date-time without offset, e.g. 2025-04-24T19:30:00>",
        "endTime"    : "<ISO-8601 local date-time without offset, OPTIONAL – omit if unknown>"
        }

        Context
        -------
        • City / area: **{LOCATION}**  
        • Desired time window: **{START_WINDOW}** to **{END_WINDOW}**  
        – If `{END_WINDOW}` is blank, treat the window as "any time *after* `{START_WINDOW}`".  

        User request
        ------------
        \"\"\"{PROMPT_PLACEHOLDER}\"\"\"

        Instructions
        ------------
        1. Determine how many distinct activities the request implies; return the same number of objects (min 1, max 5).  
        2. Pick specific, venues that satisfy the user's intent.  
        3. Ensure each `startTime` (and `endTime`, if provided) lies **within the window** defined above.  
        4. Order objects chronologically by `startTime`.  
        5. Do **NOT** add any keys, comments, or code fences.

        Example output (for reference only – do **NOT** copy):
        [
        {
            "title": "Knight's Steakhouse",
            "description": "Steak dinner with cocktails",
            "location": "600 E Liberty St, Ann Arbor, MI",
            "startTime": "2025-04-24T19:00:00",
            "endTime"  : "2025-04-24T20:30:00"
        }
        ]
        """;



        // Inject location and prompt
        systemPrompt = systemPrompt
                .replace("{LOCATION}", location)
                .replace("{PROMPT_PLACEHOLDER}", userPrompt)
                .replace("{START_WINDOW}", startDate.toString())
                .replace("{END_WINDOW}", endDate != null ? endDate.toString() : "");

        return systemPrompt;
    }

    /**
     * Sends the current conversation to the OpenAI API and returns the assistant's textual response.
     */
    private String sendChatCompletionRequest(List<ChatMessage> conversation) {
        ChatCompletionRequest request = ChatCompletionRequest.builder()
                .model(model)
                .messages(conversation)
                .temperature(0.7)
                .build();

        String response = openAiService.createChatCompletion(request)
                .getChoices()
                .get(0)
                .getMessage()
                .getContent();

        // Record the assistant response in the conversation
        conversation.add(new ChatMessage("assistant", response));
        return response;
    }

    /**
     * Parses the JSON array returned by ChatGPT into a list of ActivityDto.
     */
    private List<ActivityResponse> parseActivities(String jsonResponse) {
        try {
            // Extract the JSON array from the assistant's response
            String jsonArray = extractJsonArray(jsonResponse);

            // Convert that array into a list of ActivityDto
            return objectMapper.readValue(jsonArray, new TypeReference<List<ActivityResponse>>() {});
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse activities from ChatGPT response", e);
        }
    }

    /**
     * Finds the first '[' and the last ']' in the response to extract a valid JSON array substring.
     */
    private String extractJsonArray(String response) {
        int start = response.indexOf('[');
        int end = response.lastIndexOf(']') + 1;
        if (start == -1 || end == 0 || end <= start) {
            throw new RuntimeException("No valid JSON array found in response");
        }
        return response.substring(start, end);
    }
}
