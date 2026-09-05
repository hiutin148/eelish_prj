package com.hiutin.eelish.dto.response;

import java.util.UUID;
import java.util.List;

public record NoteTypeDto(
    UUID id,
    String name,
    List<FieldDefinitionSummaryDto> fields
) {
}