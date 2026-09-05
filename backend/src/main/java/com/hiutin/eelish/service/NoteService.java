package com.hiutin.eelish.service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.hiutin.eelish.dto.request.NoteRequest;
import com.hiutin.eelish.dto.response.NoteDto;
import com.hiutin.eelish.common.response.PageResponse;
import com.hiutin.eelish.entity.Note;
import com.hiutin.eelish.mapper.EntityDtoMapper;
import com.hiutin.eelish.repository.ImportSourceRepository;
import com.hiutin.eelish.repository.NoteRepository;
import com.hiutin.eelish.repository.NoteTypeRepository;

@Service
@Transactional
public class NoteService {
    private final NoteRepository repository;
    private final NoteTypeRepository noteTypeRepository;
    private final ImportSourceRepository sourceRepository;
    private final EntityDtoMapper mapper;

    public NoteService(NoteRepository repository, NoteTypeRepository noteTypeRepository,
            ImportSourceRepository sourceRepository, EntityDtoMapper mapper) {
        this.repository = repository;
        this.noteTypeRepository = noteTypeRepository;
        this.sourceRepository = sourceRepository;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public PageResponse<NoteDto> findAll(Pageable pageable) {
        Page<Note> page = repository.findAll(pageable);
        return PageResponse.from(page.map(mapper::toDto));
    }

    @Transactional(readOnly = true)
    public NoteDto findById(UUID id) {
        return mapper.toDto(find(id));
    }

    public NoteDto create(NoteRequest r) {
        return mapper.toDto(repository.save(toEntity(r)));
    }

    public NoteDto update(UUID id, NoteRequest r) {
        Note e = find(id);
        apply(e, r);
        return mapper.toDto(repository.save(e));
    }

    public void delete(UUID id) {
        repository.delete(find(id));
    }

    private Note find(UUID id) {
        return repository.findById(id).orElseThrow(() -> notFound("Note", id));
    }

    private Note toEntity(NoteRequest r) {
        Note e = new Note();
        apply(e, r);
        e.setCards(List.of());
        return e;
    }

    private void apply(Note e, NoteRequest r) {
        e.setNoteType(
                noteTypeRepository.findById(r.noteTypeId()).orElseThrow(() -> notFound("Note type", r.noteTypeId())));
        e.setSource(sourceRepository.findById(r.sourceId()).orElseThrow(() -> notFound("Import source", r.sourceId())));
        e.setFieldValues(r.fieldValues());
        e.setCreatedAt(r.createdAt() == null ? Instant.now() : r.createdAt());
    }

    private ResponseStatusException notFound(String type, UUID id) {
        return new ResponseStatusException(HttpStatus.NOT_FOUND, type + " not found: " + id);
    }
}