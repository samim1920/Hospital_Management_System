package com.hms.user.service;

import com.hms.user.dto.UserRequestDto;
import com.hms.user.dto.UserResponseDto;
import com.hms.user.entity.User;
import com.hms.user.exception.ResourceNotFoundException;

public interface UserServiceInterface {

    UserResponseDto userRegister(UserRequestDto userRequest);

    UserResponseDto updateUser(
            Long id,
            UserRequestDto userRequest
    );

    UserResponseDto loginUser(
            String email,
            String password
    );

    UserResponseDto getUserByEmail(
            String email
    ) throws ResourceNotFoundException;

    User getUserEntityByEmail(
            String email
    ) throws ResourceNotFoundException;

    boolean emailExists(String email);
}