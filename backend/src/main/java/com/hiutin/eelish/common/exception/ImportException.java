package com.hiutin.eelish.common.exception;

public class ImportException extends RuntimeException {
    private static final long serialVersionUID = 1L;

    public ImportException(String message, Throwable cause) {
        super(message, cause);
    }
}