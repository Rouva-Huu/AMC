package org.amc.authservice.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.amc.authservice.dto.UserUpdateRequest;
import org.amc.authservice.model.User;
import org.amc.authservice.service.AuthService;
import org.amc.authservice.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Пользователь", description = "Пользователь и его данные")
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/user")
public class UserController {
    private final UserService userService;

    @Operation(summary = "Текущий пользователь", description = "Получение информации о текущем аутентифицированном пользователе")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Пользователь найден", content = @Content(schema = @Schema(implementation = User.class))),
            @ApiResponse(responseCode = "401", description = "Пользователь не авторизован", content = @Content(schema = @Schema(implementation = Error.class)))
    })
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(Authentication authentication) {
        String username = authentication.getName();
        User user = userService.getCurrentUser(username);
        return ResponseEntity.ok(user);
    }

    @Operation(summary = "Обновить данные пользователя", description = "Обновление email, телефона и города пользователя")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Данные пользователя обновлены", content = @Content(schema = @Schema(implementation = User.class))),
            @ApiResponse(responseCode = "400", description = "Некорректные данные или уже занятые email/телефон", content = @Content(schema = @Schema(implementation = Error.class)))
    })
    @PreAuthorize("hasRole('ROLE_USER')")
    @PutMapping("/update")
    public ResponseEntity<User> updateUserData(Authentication authentication, @RequestBody UserUpdateRequest request) {
        String username = authentication.getName();
        User updatedUser = userService.update(username, request);
        return ResponseEntity.ok(updatedUser);
    }
}