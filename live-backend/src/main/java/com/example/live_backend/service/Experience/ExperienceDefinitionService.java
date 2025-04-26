package com.example.live_backend.service.Experience;

import java.util.List;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.example.live_backend.mapper.ExperienceDefinitionMapper;
import com.example.live_backend.dto.Experience.ExperienceDefinitionRequest;
import com.example.live_backend.dto.Experience.ExperienceDefinitionResponse;
import com.example.live_backend.model.Experience.ExperienceDefinition;
import com.example.live_backend.repository.Experience.ExperienceDefinitionRepository;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExperienceDefinitionService {
    private final ExperienceDefinitionRepository experienceDefinitionRepository;
    private final ExperienceDefinitionMapper experienceDefinitionMapper;

    public List<ExperienceDefinitionResponse> findAll() {
        return experienceDefinitionRepository.findAll().stream()
                .map(experienceDefinitionMapper::toResponse)
                .collect(Collectors.toList());
    }

    public ExperienceDefinitionResponse getExperienceDefinition(Long id) {
        return experienceDefinitionMapper.toResponse(experienceDefinitionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ExperienceDefinition not found")));
    }

    public ExperienceDefinitionResponse createExperienceDefinition(ExperienceDefinitionRequest request) {
        ExperienceDefinition experienceDefinition = experienceDefinitionMapper.toEntity(request);
        return experienceDefinitionMapper.toResponse(experienceDefinitionRepository.save(experienceDefinition));
    }

    public ExperienceDefinitionResponse updateExperienceDefinition(Long id, ExperienceDefinitionRequest request) {
        ExperienceDefinition existingExperienceDefinition = experienceDefinitionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ExperienceDefinition not found"));
        existingExperienceDefinition.setTitle(request.getTitle());
        return experienceDefinitionMapper.toResponse(experienceDefinitionRepository.save(existingExperienceDefinition));
    }

    public void deleteExperienceDefinition(Long id) {
        experienceDefinitionRepository.deleteById(id);
    }
}
