package com.hms.user.dto;

public class LoginResponseDto {

    private String token;
    private Long hospitalId;
    private String hospitalName;
    private String adminName;

    public LoginResponseDto() {
    }

    public LoginResponseDto(
            String token,
            Long hospitalId,
            String hospitalName,
            String adminName
    ) {
        this.token = token;
        this.hospitalId = hospitalId;
        this.hospitalName = hospitalName;
        this.adminName = adminName;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Long getHospitalId() {
        return hospitalId;
    }

    public void setHospitalId(Long hospitalId) {
        this.hospitalId = hospitalId;
    }

    public String getHospitalName() {
        return hospitalName;
    }

    public void setHospitalName(String hospitalName) {
        this.hospitalName = hospitalName;
    }

    public String getAdminName() {
        return adminName;
    }

    public void setAdminName(String adminName) {
        this.adminName = adminName;
    }
}