package com.hiutin.eelish.service;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.hiutin.eelish.dto.request.NoteTypeRequest;
import com.hiutin.eelish.dto.response.NoteTypeDto;
import com.hiutin.eelish.common.response.PageResponse;
import com.hiutin.eelish.entity.NoteType;
import com.hiutin.eelish.mapper.EntityDtoMapper;
import com.hiutin.eelish.repository.NoteTypeRepository;

@Service
@Transactional
public class NoteTypeService {
    private final NoteTypeRepository repository;
    private final EntityDtoMapper mapper;

    public NoteTypeService(NoteTypeRepository repository, EntityDtoMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public PageResponse<NoteTypeDto> findAll(Pageable pageable) {
        Page<NoteType> page = repository.findAll(pageable);
        return PageResponse.from(page.map(mapper::toDto));
    }

    @Transactional(readOnly = true)
    public NoteTypeDto findById(UUID id) {
        return mapper.toDto(find(id));
    }

    public NoteTypeDto create(NoteTypeRequest r) {
        NoteType e = new NoteType();
        e.setName(r.name());
        return mapper.toDto(repository.save(e));
    }

    public NoteTypeDto update(UUID id, NoteTypeRequest r) {
        NoteType e = find(id);
        e.setName(r.name());
        return mapper.toDto(repository.save(e));
    }

    public void delete(UUID id) {
        repository.delete(find(id));
    }

    private NoteType find(UUID id) {
        return repository.findById(id).orElseThrow(() -> notFound(id));
    }

    private ResponseStatusException notFound(UUID id) {
        return new ResponseStatusException(HttpStatus.NOT_FOUND, "Note type not found: " + id);
    }
}