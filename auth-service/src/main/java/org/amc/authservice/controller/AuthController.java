package org.amc.authservice.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.amc.authservice.dto.AuthResponse;
import org.amc.authservice.dto.LoginRequest;
import org.amc.authservice.dto.RegisterRequest;
import org.amc.authservice.model.User;
import org.amc.authservice.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Tag(name = "Аутентификация", description = "Регистрация и вход пользователей")
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    @Operation(summary = "Регистрация пользователя", description = "Регистрирует нового пользователя")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Пользователь создан", content = @Content(schema = @Schema(implementation = User.class))),
            @ApiResponse(responseCode = "400", description = "Неверный запрос", content = @Content(schema = @Schema(implementation = Error.class)))
    })
    @PostMapping("/register")
    public ResponseEntity<?> register(Authentication authentication, @RequestBody RegisterRequest request) {
        if (authentication != null && authentication.isAuthenticated()) {
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body("Вы уже вошли в систему. Выйдите, чтобы создать новый аккаунт.");
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", authService.register(request)));
    }

    @Operation(summary = "Авторизация пользователя", description = "Вход пользователя по username и паролю")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Успешная авторизация", content = @Content(schema = @Schema(implementation = AuthResponse.class))),
            @ApiResponse(responseCode = "401", description = "Неверные учетные данные", content = @Content(schema = @Schema(implementation = Error.class)))
    })
    @PostMapping("/login")
    public ResponseEntity<?> login(Authentication authentication, @RequestBody LoginRequest request) {
        if (authentication != null && authentication.isAuthenticated()) {
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body("Вы уже вошли в систему. Выйдите, чтобы создать новый аккаунт.");
        }
        AuthResponse token = authService.login(request);
        return ResponseEntity.ok(token);
    }
}