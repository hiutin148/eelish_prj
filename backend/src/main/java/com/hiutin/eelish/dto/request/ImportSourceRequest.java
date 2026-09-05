package com.hiutin.eelish.dto.request;

import java.time.Instant;

public record ImportSourceRequest(String fileType, String fileName, Instant importedAt) {
}