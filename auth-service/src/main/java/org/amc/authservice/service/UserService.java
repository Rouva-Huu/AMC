package org.amc.authservice.service;

import lombok.RequiredArgsConstructor;
import org.amc.authservice.dto.UserUpdateRequest;
import org.amc.authservice.model.User;
import org.amc.authservice.repository.UserRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class UserService {

    private final UserRepository userRepository;

    public User getCurrentUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    public User update(String username, UserUpdateRequest request) {
        User currentUser = getCurrentUser(username);

        String email = request.email();
        String phone = request.phone();
        String city = request.city();

        if (email != null && !email.trim().isEmpty()) {
            // Проверяем, что новый email не используется другим пользователем
            if (userRepository.existsByEmail(email) && !email.equals(currentUser.getEmail())) {
                throw new IllegalArgumentException("Email already in use");
            }
            currentUser.setEmail(email);
        }

        // Проверка уникальности phone
        if (phone != null && !phone.trim().isEmpty()) {
            // Проверяем, что новый phone не используется другим пользователем
            if (userRepository.existsByPhone(phone) && !phone.equals(currentUser.getPhone())) {
                throw new IllegalArgumentException("Phone number already in use");
            }
            currentUser.setPhone(phone);
        } else {
            currentUser.setPhone(null);  // или не меняем, если предполагается оставить старое значение
        }

        // Обработка city (если передан пустой или пробельный string, заменяем на null)
        if (city != null && !city.trim().isEmpty()) {
            currentUser.setCity(city);
        } else {
            currentUser.setCity(null);  // или не меняем, если предполагается оставить старое значение
        }

        return userRepository.save(currentUser);
    }
}
