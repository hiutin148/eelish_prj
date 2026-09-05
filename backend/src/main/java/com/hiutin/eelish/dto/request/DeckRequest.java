package com.hiutin.eelish.dto.request;

import java.util.UUID;

public record DeckRequest(String name, UUID parentDeckId) {
}