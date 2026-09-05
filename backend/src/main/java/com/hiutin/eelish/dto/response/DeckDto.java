package com.hiutin.eelish.dto.response;

import java.util.UUID;

public record DeckDto(
    UUID id,
    String name,
    DeckSummaryDto parentDeck
) {
}