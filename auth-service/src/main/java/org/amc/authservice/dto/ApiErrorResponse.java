package org.amc.authservice.dto;

public record ApiErrorResponse(String message, String path, int status) {
}
