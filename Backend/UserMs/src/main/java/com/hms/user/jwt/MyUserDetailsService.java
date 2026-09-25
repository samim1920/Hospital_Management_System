package com.hms.user.jwt;

import com.hms.user.entity.User;
import com.hms.user.exception.ResourceNotFoundException;
import com.hms.user.service.UserServiceImplement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class MyUserDetailsService implements UserDetailsService {

    @Autowired
    private UserServiceImplement userService;

    @Override
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {

        try {

            User user = userService.getUserEntityByEmail(email);

            return new CoustomUserDetails(
                    user.getId(),
                    user.getEmail(),
                    user.getPassword(),
                    user.getAdminName()
            );

        } catch (ResourceNotFoundException ex) {

            throw new UsernameNotFoundException(
                    "User not found with email: " + email
            );
        }
    }
}
