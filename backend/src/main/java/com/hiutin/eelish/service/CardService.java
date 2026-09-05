package com.hiutin.eelish.service;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.hiutin.eelish.dto.request.CardRequest;
import com.hiutin.eelish.dto.response.CardDto;
import com.hiutin.eelish.common.response.PageResponse;
import com.hiutin.eelish.entity.Card;
import com.hiutin.eelish.mapper.EntityDtoMapper;
import com.hiutin.eelish.repository.CardRepository;
import com.hiutin.eelish.repository.DeckRepository;
import com.hiutin.eelish.repository.NoteRepository;

@Service
@Transactional
public class CardService {
    private final CardRepository repository;
    private final NoteRepository noteRepository;
    private final DeckRepository deckRepository;
    private final EntityDtoMapper mapper;

    public CardService(CardRepository repository, NoteRepository noteRepository, DeckRepository deckRepository,
            EntityDtoMapper mapper) {
        this.repository = repository;
        this.noteRepository = noteRepository;
        this.deckRepository = deckRepository;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public PageResponse<CardDto> findAll(Pageable pageable) {
        Page<Card> page = repository.findAll(pageable);
        return PageResponse.from(page.map(mapper::toDto));
    }

    @Transactional(readOnly = true)
    public CardDto findById(UUID id) {
        return mapper.toDto(find(id));
    }

    public CardDto create(CardRequest r) {
        return mapper.toDto(repository.save(toEntity(r)));
    }

    public CardDto update(UUID id, CardRequest r) {
        Card e = find(id);
        apply(e, r);
        return mapper.toDto(repository.save(e));
    }

    public void delete(UUID id) {
        repository.delete(find(id));
    }

    private Card find(UUID id) {
        return repository.findById(id).orElseThrow(() -> notFound("Card", id));
    }

    private Card toEntity(CardRequest r) {
        Card e = new Card();
        apply(e, r);
        return e;
    }

    private void apply(Card e, CardRequest r) {
        e.setNote(noteRepository.findById(r.noteId()).orElseThrow(() -> notFound("Note", r.noteId())));
        e.setDeck(deckRepository.findById(r.deckId()).orElseThrow(() -> notFound("Deck", r.deckId())));
        e.setTemplateName(r.templateName());
        e.setIntervalDays(r.intervalDays());
        e.setEaseFactor(r.easeFactor());
        e.setDueAt(r.dueAt());
    }

    private ResponseStatusException notFound(String type, UUID id) {
        return new ResponseStatusException(HttpStatus.NOT_FOUND, type + " not found: " + id);
    }
}