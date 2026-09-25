package com.DoctorMs.DoctorMs.dto;

import java.util.List;

public class DoctorResponseDto {

    private Long id;
    private String doctorname;
    private String doctorid;
    private String email;
    private String phone;
    private String department;
    private String experience;
    private String qualification;
    private String bio;
    private Double rating;
    private Double consultationFee;
    private String imageUrl;
    private Boolean available;

    // Separate gallery images
    private List<DoctorGalleryResponseDto> galleryImages;


    // =========================
    // Constructor
    // =========================

    public DoctorResponseDto() {
    }

    public DoctorResponseDto(
            Long id,
            String doctorname,
            String doctorid,
            String email,
            String phone,
            String department,
            String experience,
            String qualification,
            String bio,
            Double rating,
            Double consultationFee,
            String imageUrl,
            Boolean available,
            List<DoctorGalleryResponseDto> galleryImages
    ) {
        this.id = id;
        this.doctorname = doctorname;
        this.doctorid = doctorid;
        this.email = email;
        this.phone = phone;
        this.department = department;
        this.experience = experience;
        this.qualification = qualification;
        this.bio = bio;
        this.rating = rating;
        this.consultationFee = consultationFee;
        this.imageUrl = imageUrl;
        this.available = available;
        this.galleryImages = galleryImages;
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

    public String getDoctorname() {
        return doctorname;
    }

    public void setDoctorname(String doctorname) {
        this.doctorname = doctorname;
    }

    public String getDoctorid() {
        return doctorid;
    }

    public void setDoctorid(String doctorid) {
        this.doctorid = doctorid;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getExperience() {
        return experience;
    }

    public void setExperience(String experience) {
        this.experience = experience;
    }

    public String getQualification() {
        return qualification;
    }

    public void setQualification(String qualification) {
        this.qualification = qualification;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public Double getConsultationFee() {
        return consultationFee;
    }

    public void setConsultationFee(Double consultationFee) {
        this.consultationFee = consultationFee;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Boolean getAvailable() {
        return available;
    }

    public void setAvailable(Boolean available) {
        this.available = available;
    }

    public List<DoctorGalleryResponseDto> getGalleryImages() {
        return galleryImages;
    }

    public void setGalleryImages(List<DoctorGalleryResponseDto> galleryImages) {
        this.galleryImages = galleryImages;
    }
}