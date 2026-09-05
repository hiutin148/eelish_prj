package com.hiutin.eelish.dto.request;

import java.util.UUID;

public record FieldDefinitionRequest(UUID noteTypeId, String fieldName, int displayOrder) {
}