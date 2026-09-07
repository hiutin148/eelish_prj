package com.hiutin.eelish.dto.response;

import java.util.List;
import java.util.UUID;

public record DeckDto(
    UUID id,
    String name,
    DeckSummaryDto parentDeck,
    List<DeckDto> childDecks
) {
}