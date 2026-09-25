package com.DoctorMs.DoctorMs.dto;

public class DoctorGalleryResponseDto {

    private Long id;
    private String imageUrl;

    public DoctorGalleryResponseDto() {
    }

    public DoctorGalleryResponseDto(Long id, String imageUrl) {
        this.id = id;
        this.imageUrl = imageUrl;
    }

    // =========================
    // Getters & Setters
    // =========================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}