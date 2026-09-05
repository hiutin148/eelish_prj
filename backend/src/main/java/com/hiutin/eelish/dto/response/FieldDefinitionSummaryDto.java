package com.hiutin.eelish.dto.response;

import java.util.UUID;

public record FieldDefinitionSummaryDto(UUID id, String fieldName, int displayOrder) {
}