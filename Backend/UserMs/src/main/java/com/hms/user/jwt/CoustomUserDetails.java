package com.hms.user.jwt;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CoustomUserDetails implements UserDetails {

    private Long id;
    private String username;
    private String password;
    private String name;
    private String email;

    private Collection<? extends GrantedAuthority> authorities;

    public CoustomUserDetails(
            Long id,
            String username,
            String password,
            String name
    ) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.name = name;
        this.authorities = Collections.emptyList();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}