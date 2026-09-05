package com.hiutin.eelish.dto.request;

import java.time.Instant;
import java.util.UUID;

public record CardRequest(UUID noteId, UUID deckId, String templateName, int intervalDays, float easeFactor,
        Instant dueAt) {
}