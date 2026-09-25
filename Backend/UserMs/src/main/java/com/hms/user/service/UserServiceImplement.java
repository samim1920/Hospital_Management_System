package com.hms.user.service;

import com.hms.user.dto.UserRequestDto;
import com.hms.user.dto.UserResponseDto;
import com.hms.user.entity.User;
import com.hms.user.exception.DublicateResourceException;
import com.hms.user.exception.ResourceNotFoundException;
import com.hms.user.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImplement implements UserServiceInterface {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImplement(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // =========================
    // REGISTER USER
    // =========================

    @Override
    public UserResponseDto userRegister(UserRequestDto userRequest) {

        System.out.println("========== REGISTER START ==========");

        System.out.println("Hospital: " + userRequest.getHospitalName());
        System.out.println("Admin: " + userRequest.getAdminName());
        System.out.println("Email: " + userRequest.getEmail());
        System.out.println("Phone: " + userRequest.getPhone());

        if (userRepository.existsByEmail(userRequest.getEmail())) {
            throw new DublicateResourceException("Email already registered");
        }

        User user = new User();

        user.setHospitalName(userRequest.getHospitalName());
        user.setAdminName(userRequest.getAdminName());
        user.setEmail(userRequest.getEmail());
        user.setPhone(userRequest.getPhone());

        user.setPassword(
                passwordEncoder.encode(userRequest.getPassword())
        );

        System.out.println("Before save...");

        User savedUser = userRepository.save(user);

        System.out.println("After save...");
        System.out.println("Saved ID: " + savedUser.getId());

        UserResponseDto response = convertToResponseDto(savedUser);

        System.out.println("Response DTO created...");
        System.out.println("Response ID: " + response.getId());
        System.out.println("Response Hospital: " + response.getHospitalName());
        System.out.println("Response Admin: " + response.getAdminName());

        System.out.println("========== REGISTER END ==========");

        return response;
    }

    // =========================
    // UPDATE USER
    // =========================
    @Override
    public UserResponseDto updateUser(
            Long id,
            UserRequestDto userRequest
    ) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found with id: " + id)
                );

        user.setHospitalName(userRequest.getHospitalName());
        user.setAdminName(userRequest.getAdminName());
        user.setEmail(userRequest.getEmail());
        user.setPhone(userRequest.getPhone());

        // Update password only if provided
        if (userRequest.getPassword() != null
                && !userRequest.getPassword().isBlank()) {

            user.setPassword(
                    passwordEncoder.encode(userRequest.getPassword())
            );
        }

        User updatedUser = userRepository.save(user);

        return convertToResponseDto(updatedUser);
    }

    // =========================
    // LOGIN USER
    // =========================
    @Override
    public UserResponseDto loginUser(
            String email,
            String password
    ) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with email: " + email
                        )
                );

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        return convertToResponseDto(user);
    }

    // =========================
    // GET USER BY EMAIL
    // =========================
    @Override
    public UserResponseDto getUserByEmail(String email)
            throws ResourceNotFoundException {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with email: " + email
                        )
                );

        return convertToResponseDto(user);
    }

    // =========================
    // ENTITY → RESPONSE DTO
    // =========================
    private UserResponseDto convertToResponseDto(User user) {

        UserResponseDto response = new UserResponseDto();

        response.setId(user.getId());
        response.setHospitalName(user.getHospitalName());
        response.setAdminName(user.getAdminName());
        response.setEmail(user.getEmail());
        response.setPhone(user.getPhone());

        return response;
    }

    @Override
    public User getUserEntityByEmail(String email)
            throws ResourceNotFoundException {

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with email: " + email
                        )
                );
    }

    @Override
    public boolean emailExists(String email) {

        return userRepository.existsByEmail(email);
    }
}
