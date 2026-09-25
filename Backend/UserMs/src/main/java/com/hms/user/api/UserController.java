package com.hms.user.api;

import com.hms.user.dto.*;
import com.hms.user.entity.PendingRegistration;
import com.hms.user.entity.User;
import com.hms.user.jwt.JwtUtil;
import com.hms.user.repository.PendingRegistrationRepository;
import com.hms.user.repository.UserRepository;
import com.hms.user.service.OtpService;
import com.hms.user.service.UserServiceImplement;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserController {

    private final UserServiceImplement userService;
    private final UserDetailsService userDetailsService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    private final OtpService otpService;
    private final PendingRegistrationRepository pendingRegistrationRepository;
    private final UserRepository userRepository;


    public UserController(
            UserServiceImplement userService,
            UserDetailsService userDetailsService,
            AuthenticationManager authenticationManager,
            JwtUtil jwtUtil,
            OtpService otpService,
            PendingRegistrationRepository pendingRegistrationRepository,
            UserRepository userRepository
    ) {
        this.userService = userService;
        this.userDetailsService = userDetailsService;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.otpService = otpService;
        this.pendingRegistrationRepository =
                pendingRegistrationRepository;
        this.userRepository = userRepository;
    }


    // =====================================================
    // SEND REGISTRATION OTP
    // POST: /user/register/send-otp
    // =====================================================

    @PostMapping("/register/send-otp")
    public ResponseEntity<String> sendRegistrationOtp(
            @RequestBody SendOtpRequest request
    ) {

        try {

            if (userService.emailExists(request.getEmail())) {

                return ResponseEntity
                        .status(HttpStatus.CONFLICT)
                        .body("Email already registered");
            }

            PendingRegistration registration =
                    pendingRegistrationRepository
                            .findByEmail(request.getEmail())
                            .orElse(new PendingRegistration());

            registration.setHospitalName(
                    request.getHospitalName()
            );

            registration.setAdminName(
                    request.getAdminName()
            );

            registration.setEmail(
                    request.getEmail()
            );

            registration.setPhone(
                    request.getPhone()
            );

            registration.setPassword(
                    request.getPassword()
            );

            pendingRegistrationRepository.save(
                    registration
            );

            // SEND OTP
            otpService.sendOtp(
                    registration.getEmail(),
                    "REGISTER_ADMIN"
            );

            return ResponseEntity.ok(
                    "OTP sent successfully to "
                            + request.getEmail()
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(
                            "Failed to send OTP: "
                                    + e.getMessage()
                    );
        }
    }


    // =====================================================
    // VERIFY REGISTRATION OTP
    // POST: /user/register/verify-otp
    // =====================================================

    @Transactional
    @PostMapping("/register/verify-otp")
    public ResponseEntity<?> verifyRegistrationOtp(
            @RequestBody VerifyOtpRequest request
    ) {

        boolean verified =
                otpService.verifyOtp(
                        request.getEmail(),
                        request.getOtp(),
                        "REGISTER_ADMIN"
                );

        if (!verified) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Invalid or expired OTP");
        }

        PendingRegistration registration =
                pendingRegistrationRepository
                        .findByEmail(request.getEmail())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Registration data not found"
                                )
                        );

        UserRequestDto userRequest =
                new UserRequestDto();

        userRequest.setHospitalName(
                registration.getHospitalName()
        );

        userRequest.setAdminName(
                registration.getAdminName()
        );

        userRequest.setEmail(
                registration.getEmail()
        );

        userRequest.setPhone(
                registration.getPhone()
        );

        userRequest.setPassword(
                registration.getPassword()
        );

        UserResponseDto userResponse =
                userService.userRegister(
                        userRequest
                );

        pendingRegistrationRepository.deleteByEmail(
                request.getEmail()
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(userResponse);
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

            // =========================================
            // Authenticate user
            // =========================================

            Authentication authentication =
                    authenticationManager.authenticate(
                            new UsernamePasswordAuthenticationToken(
                                    loginDto.getEmail(),
                                    loginDto.getPassword()
                            )
                    );


            UserDetails userDetails =
                    (UserDetails) authentication.getPrincipal();


            // =========================================
            // Generate JWT
            // =========================================

            String jwt =
                    jwtUtil.generateToken(userDetails);


            // =========================================
            // Get user from database
            // =========================================

            User user =
                    userRepository
                            .findByEmail(loginDto.getEmail())
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "User not found"
                                    )
                            );


            // =========================================
            // Create login response
            // =========================================

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
                    .body(
                            "Invalid username or password"
                    );
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