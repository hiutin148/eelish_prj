package com.hiutin.eelish.dto.request;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

public record NoteRequest(UUID noteTypeId, UUID sourceId, Map<String, Object> fieldValues, Instant createdAt) {
}