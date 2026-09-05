package com.hiutin.eelish.dto.response;

import java.time.Instant;
import java.util.UUID;

public record ImportSourceSummaryDto(UUID id, String fileType, String fileName, Instant importedAt) {
}