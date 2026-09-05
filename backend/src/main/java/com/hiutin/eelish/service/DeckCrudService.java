package com.hiutin.eelish.service;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.hiutin.eelish.dto.request.DeckRequest;
import com.hiutin.eelish.dto.response.DeckDto;
import com.hiutin.eelish.common.response.PageResponse;
import com.hiutin.eelish.entity.Deck;
import com.hiutin.eelish.mapper.EntityDtoMapper;
import com.hiutin.eelish.repository.DeckRepository;

@Service
@Transactional
public class DeckCrudService {
    private final DeckRepository repository;
    private final EntityDtoMapper mapper;

    public DeckCrudService(DeckRepository repository, EntityDtoMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public PageResponse<DeckDto> findAll(Pageable pageable) {
        Page<Deck> page = repository.findAll(pageable);
        return PageResponse.from(page.map(mapper::toDto));
    }

    @Transactional(readOnly = true)
    public DeckDto findById(UUID id) {
        return mapper.toDto(find(id));
    }

    public DeckDto create(DeckRequest r) {
        return mapper.toDto(repository.save(toEntity(r)));
    }

    public DeckDto update(UUID id, DeckRequest r) {
        Deck e = find(id);
        e.setName(r.name());
        e.setParentDeck(parent(r.parentDeckId()));
        return mapper.toDto(repository.save(e));
    }

    public void delete(UUID id) {
        repository.delete(find(id));
    }

    private Deck find(UUID id) {
        return repository.findById(id).orElseThrow(() -> notFound(id));
    }

    private Deck toEntity(DeckRequest r) {
        Deck e = new Deck();
        e.setName(r.name());
        e.setParentDeck(parent(r.parentDeckId()));
        e.setCards(List.of());
        e.setChildDecks(List.of());
        return e;
    }

    private Deck parent(UUID id) {
        return id == null ? null : find(id);
    }

    private ResponseStatusException notFound(UUID id) {
        return new ResponseStatusException(HttpStatus.NOT_FOUND, "Deck not found: " + id);
    }
}