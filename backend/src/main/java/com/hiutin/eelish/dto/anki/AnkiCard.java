package com.hiutin.eelish.dto.anki;

public record AnkiCard(
    Long id,
    Long noteId,
    Long deckId,
    Integer templateOrd
) {}
