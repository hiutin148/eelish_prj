package com.hiutin.eelish.dto.response;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

public record NoteSummaryDto(UUID id, Map<String, Object> fieldValues, Instant createdAt) {
}