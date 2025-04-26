package com.example.live_backend.service.chatGPT;

import com.example.live_backend.dto.Activity.ActivityResponse;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.theokanning.openai.completion.chat.ChatCompletionRequest;
import com.theokanning.openai.completion.chat.ChatMessage;
import com.theokanning.openai.service.OpenAiService;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Slf4j
class ScheduleRefiner {

    /* --- prompts --- */
    private static final String BASE_RULES = """
        You are an assistant that ALWAYS replies ONLY with a JSON array (no prose, no code fences).
        Each element = {title, description, location, startTime}.
        startTime must be ISO-8601 **without** offset (yyyy-MM-dd'T'HH:mm:ss).
        """;

    private static final String REFINE_RULES = """
        You will receive the CURRENT schedule (assistant role) plus a user refinement request.
        Return the UPDATED schedule, preserving the exact key set. Do not add commentary.
        """;

    /* --- state --- */
    private final OpenAiService openAi;
    private final ObjectMapper mapper;
    private final String model;
    private final List<ChatMessage> conversation = new ArrayList<>();

    ScheduleRefiner(OpenAiService openAi, ObjectMapper mapper, String model) {
        this.openAi = openAi;
        this.mapper = mapper;
        this.model = model;
        conversation.add(new ChatMessage("system", BASE_RULES));
    }

    /* -------- public helpers -------- */
    List<ActivityResponse> generateInitialSchedule(String prompt, String loc,
                                                   LocalDateTime start, LocalDateTime end) {
        conversation.add(new ChatMessage("system", buildPrompt(loc, start, end, prompt)));
        conversation.add(new ChatMessage("user", prompt));
        return callAndParse();
    }

    List<ActivityResponse> refineSchedule(List<ActivityResponse> current, String diff) {
        try {
            conversation.add(new ChatMessage("system", REFINE_RULES));
            conversation.add(new ChatMessage("assistant", mapper.writeValueAsString(current)));
            conversation.add(new ChatMessage("user", diff));
            return callAndParse();
        } catch (Exception e) {
            throw new RuntimeException("Failed to refine schedule", e);
        }
    }

    List<ActivityResponse> recommendFollowUps(String chosen) {
        conversation.add(new ChatMessage("user",
                "The user selected: " + chosen + ". Suggest 3 follow-up activities that pair well."));
        return callAndParse();
    }

    /* -------- internals -------- */
    private List<ActivityResponse> callAndParse() {
        ChatCompletionRequest req = ChatCompletionRequest.builder()
        .model(model)
        .messages(conversation)
        .temperature(0.7)
        .build();

        String json = openAi.createChatCompletion(req)
                    .getChoices().getFirst()
                    .getMessage().getContent();

        try {
            List<ActivityResponse> list =
                    mapper.readValue(json, new TypeReference<List<ActivityResponse>>() {});
            conversation.add(new ChatMessage("assistant", json));
            return list;
        } catch (Exception ex) {
            log.error("JSON parse failed: {}", json);
            throw new RuntimeException("GPT returned invalid JSON", ex);
        }
    }

    private String buildPrompt(String loc, LocalDateTime start,
                               LocalDateTime end, String ask) {
        return """
            Context:
            City / area: **%s**
            Desired window: **%s** to **%s**
            User request:
            \"%s\"
            """.formatted(loc, start, end == null ? "(open-ended)" : end, ask);
    }
}
