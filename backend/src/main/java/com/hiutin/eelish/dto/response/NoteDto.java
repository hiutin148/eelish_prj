package com.hiutin.eelish.dto.response;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

public record NoteDto(
    UUID id,
    NoteTypeSummaryDto noteType,
    ImportSourceSummaryDto source,
    Map<String, Object> fieldValues,
    Instant createdAt
) {
}