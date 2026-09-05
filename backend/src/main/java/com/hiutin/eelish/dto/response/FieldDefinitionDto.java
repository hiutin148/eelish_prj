package com.hiutin.eelish.dto.response;

import java.util.UUID;

public record FieldDefinitionDto(
    UUID id,
    NoteTypeSummaryDto noteType,
    String fieldName,
    int displayOrder
) {
}