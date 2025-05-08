package org.amc.authservice.exception;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.swagger.v3.oas.annotations.Hidden;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Hidden
@RestControllerAdvice
public class JwtExceptionHandler {

    @ExceptionHandler({ MalformedJwtException.class, UnsupportedJwtException.class,
            ExpiredJwtException.class})
    public ResponseEntity<String> handleJwtException(Exception ex) {
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body("Ошибка токена: " + ex.getMessage());
    }
}