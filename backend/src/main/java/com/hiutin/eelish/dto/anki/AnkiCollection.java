package com.hiutin.eelish.dto.anki;

import java.util.List;

public record AnkiCollection(
    List<AnkiDeck> decks,
    List<AnkiModel> models,
    List<AnkiNote> notes,
    List<AnkiCard> cards,
    List<AnkiMedia> media
) {}