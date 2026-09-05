package com.hiutin.eelish.dto.anki;

public record AnkiTemplate(
    String name,
    Integer ord,
    String qfmt,
    String afmt,
    String bqfmt,
    String bafmt,
    Long did,
    String bfont,
    Integer bsize
) {}
