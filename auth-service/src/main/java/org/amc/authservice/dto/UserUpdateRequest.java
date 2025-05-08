package org.amc.authservice.dto;

public record UserUpdateRequest(String email, String phone, String city) {}
