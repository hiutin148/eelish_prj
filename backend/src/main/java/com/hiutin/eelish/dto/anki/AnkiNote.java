package com.hiutin.eelish.dto.anki;

public record AnkiNote(
    Long id,
    Long modelId,
    String fields,
    String tags
) {}
