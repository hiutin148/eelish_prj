package com.hiutin.eelish.common.response;

import java.time.LocalDateTime;

import lombok.Getter;

@Getter
public class ApiResponse<T> {
    private boolean success;
    private int statusCode;
    private String message;
    private T data;
    private String errorCode;
    private LocalDateTime timestamp;

    private ApiResponse(boolean success, int statusCode, String message, T data, String errorCode) {
        this.success = success;
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.errorCode = errorCode;
        this.timestamp = LocalDateTime.now();
    }

    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, 200, "Success", data, null);
    }

    public static <T> ApiResponse<T> success(int statusCode, String message, T data) {
        return new ApiResponse<>(true, statusCode, message, data, null);
    }

    public static <T> ApiResponse<T> created(T data) {
        return new ApiResponse<>(true, 201, "Created", data, null);
    }

    public static <T> ApiResponse<T> error(int statusCode, String message, T data, String errorCode) {
        return new ApiResponse<>(false, statusCode, message, data, errorCode);
    }

    public static <T> ApiResponse<T> error(int statusCode, String message, String errorCode) {
        return new ApiResponse<>(false, statusCode, message, null, errorCode);
    }

}