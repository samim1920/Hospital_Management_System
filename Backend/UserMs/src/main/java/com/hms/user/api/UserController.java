package com.hms.user.api;

import com.hms.user.dto.LoginDto;
import com.hms.user.dto.LoginResponseDto;
import com.hms.user.dto.UserRequestDto;
import com.hms.user.dto.UserResponseDto;
import com.hms.user.entity.User;
import com.hms.user.jwt.JwtUtil;
import com.hms.user.repository.UserRepository;
import com.hms.user.service.UserServiceImplement;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserController {

    private final UserServiceImplement userService;
    private final UserDetailsService userDetailsService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    public UserController(
            UserServiceImplement userService,
            UserDetailsService userDetailsService,
            AuthenticationManager authenticationManager,
            JwtUtil jwtUtil,
            UserRepository userRepository
    ) {
        this.userService = userService;
        this.userDetailsService = userDetailsService;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }


    // =====================================================
    // DIRECT REGISTRATION
    // POST: /user/register
    // =====================================================

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody UserRequestDto userRequest
    ) {

        try {

            // Check if email already exists
            if (userService.emailExists(userRequest.getEmail())) {

                return ResponseEntity
                        .status(HttpStatus.CONFLICT)
                        .body("Email already registered");
            }

            // Directly create user
            UserResponseDto userResponse =
                    userService.userRegister(userRequest);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(userResponse);

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Registration failed: " + e.getMessage());
        }
    }


    // =====================================================
    // LOGIN
    // POST: /user/login
    // =====================================================

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginDto loginDto
    ) {

        try {

            // Authenticate user
            Authentication authentication =
                    authenticationManager.authenticate(
                            new UsernamePasswordAuthenticationToken(
                                    loginDto.getEmail(),
                                    loginDto.getPassword()
                            )
                    );


            // Get authenticated user details
            UserDetails userDetails =
                    (UserDetails) authentication.getPrincipal();


            // Generate JWT
            String jwt =
                    jwtUtil.generateToken(userDetails);


            // Get user from database
            User user =
                    userRepository
                            .findByEmail(loginDto.getEmail())
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "User not found"
                                    )
                            );


            // Create login response
            LoginResponseDto response =
                    new LoginResponseDto(
                            jwt,
                            user.getId(),
                            user.getHospitalName(),
                            user.getAdminName()
                    );


            return ResponseEntity.ok(response);


        } catch (BadCredentialsException e) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid username or password");

        } catch (Exception e) {

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Login failed: " + e.getMessage());
        }
    }


    // =====================================================
    // TEST
    // GET: /user/test
    // =====================================================

    @GetMapping("/test")
    public ResponseEntity<String> test() {

        return ResponseEntity.ok(
                "UserMs is working!"
        );
    }
}