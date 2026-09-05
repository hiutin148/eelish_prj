package com.hiutin.eelish.dto.anki;

import java.util.List;

public record AnkiModel(
    Long id,
    String name,
    Integer type,
    Long mod,
    Integer usn,
    Integer sortf,
    Long did,
    List<AnkiTemplate> templates,
    List<AnkiField> fields,
    String css,
    String latexPre,
    String latexPost,
    Boolean latexSvg,
    List<List<Object>> req
) {}
