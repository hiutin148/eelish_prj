package com.hiutin.eelish.service;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.hiutin.eelish.dto.request.FieldDefinitionRequest;
import com.hiutin.eelish.dto.response.FieldDefinitionDto;
import com.hiutin.eelish.common.response.PageResponse;
import com.hiutin.eelish.entity.FieldDefinition;
import com.hiutin.eelish.entity.NoteType;
import com.hiutin.eelish.mapper.EntityDtoMapper;
import com.hiutin.eelish.repository.FieldDefinitionRepository;
import com.hiutin.eelish.repository.NoteTypeRepository;

@Service
@Transactional
public class FieldDefinitionService {
    private final FieldDefinitionRepository repository;
    private final NoteTypeRepository noteTypeRepository;
    private final EntityDtoMapper mapper;

    public FieldDefinitionService(FieldDefinitionRepository repository, NoteTypeRepository noteTypeRepository,
            EntityDtoMapper mapper) {
        this.repository = repository;
        this.noteTypeRepository = noteTypeRepository;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public PageResponse<FieldDefinitionDto> findAll(Pageable pageable) {
        Page<FieldDefinition> page = repository.findAll(pageable);
        return PageResponse.from(page.map(mapper::toDto));
    }

    @Transactional(readOnly = true)
    public FieldDefinitionDto findById(UUID id) {
        return mapper.toDto(find(id));
    }

    public FieldDefinitionDto create(FieldDefinitionRequest r) {
        return mapper.toDto(repository.save(toEntity(r)));
    }

    public FieldDefinitionDto update(UUID id, FieldDefinitionRequest r) {
        FieldDefinition e = find(id);
        apply(e, r);
        return mapper.toDto(repository.save(e));
    }

    public void delete(UUID id) {
        repository.delete(find(id));
    }

    private FieldDefinition find(UUID id) {
        return repository.findById(id).orElseThrow(() -> notFound("Field definition", id));
    }

    private FieldDefinition toEntity(FieldDefinitionRequest r) {
        FieldDefinition e = new FieldDefinition();
        apply(e, r);
        return e;
    }

    private void apply(FieldDefinition e, FieldDefinitionRequest r) {
        e.setNoteType(noteType(r.noteTypeId()));
        e.setFieldName(r.fieldName());
        e.setDisplayOrder(r.displayOrder());
    }

    private NoteType noteType(UUID id) {
        return noteTypeRepository.findById(id).orElseThrow(() -> notFound("Note type", id));
    }

    private ResponseStatusException notFound(String type, UUID id) {
        return new ResponseStatusException(HttpStatus.NOT_FOUND, type + " not found: " + id);
    }
}