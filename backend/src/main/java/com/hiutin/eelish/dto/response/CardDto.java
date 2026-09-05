package com.hiutin.eelish.dto.response;

import java.time.Instant;
import java.util.UUID;

public record CardDto(
    UUID id,
    NoteSummaryDto note,
    DeckSummaryDto deck,
    String templateName,
    int intervalDays,
    float easeFactor,
    Instant dueAt
) {
}