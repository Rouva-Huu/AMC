package org.amc.authservice.service;

import lombok.RequiredArgsConstructor;
import org.amc.authservice.dto.AuthResponse;
import org.amc.authservice.dto.LoginRequest;
import org.amc.authservice.dto.RegisterRequest;
import org.amc.authservice.exception.UserAlreadyExistsException;
import org.amc.authservice.model.Role;
import org.amc.authservice.model.User;
import org.amc.authservice.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authManager;
    private final JwtService jwtService;

    public String register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.username())) {
            throw new UserAlreadyExistsException("Username already exists");
        }

        User user = new User();
        user.setName(request.name());
        user.setUsername(request.username());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole(Role.USER);
        userRepository.save(user);

        return "User registered successfully";
    }

    public AuthResponse login(LoginRequest request) {
        Authentication auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.username(), request.password())
        );
        UserDetails userDetails = (UserDetails) auth.getPrincipal();
        String jwt = jwtService.generateToken(userDetails);
        return new AuthResponse(jwt);
    }
}