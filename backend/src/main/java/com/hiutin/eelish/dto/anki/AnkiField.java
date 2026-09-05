package com.hiutin.eelish.dto.anki;

import java.util.ArrayList;

public record AnkiField(
    String name,
    Integer ord,
    Boolean sticky,
    Boolean rtl,
    String font,
    Integer size,
    String description,
    Boolean plainText,
    Boolean collapsed,
    Boolean excludeFromSearch,
    Boolean preventDeletion,
    ArrayList<String> media
) {}