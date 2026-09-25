package com.DoctorMs.DoctorMs.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
        name = "doctor",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_doctor_hospital",
                        columnNames = {"doctor_id", "hospital_id"}
                )
        }
)
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // =========================
    // BASIC INFORMATION
    // =========================

    @Column(nullable = false)
    private String doctorname;

    @Column(name = "doctor_id", nullable = false)
    private String doctorid;

    @Column(nullable = false)
    private String email;

    private String phone;

    // =========================
    // PROFESSIONAL INFORMATION
    // =========================

    @Column(nullable = false)
    private String department;

    @Column(nullable = false)
    private String experience;

    private String qualification;

    @Column(columnDefinition = "TEXT")
    private String bio;

    private Double rating;

    // =========================
    // CONSULTATION
    // =========================

    @Column(name = "consultation_fee", nullable = false)
    private Double consultationFee;

    @Column(nullable = false)
    private Boolean available;

    // =========================
    // PROFILE IMAGE
    // =========================

    @Column(name = "image_url")
    private String imageUrl;

    // =========================
    // HOSPITAL
    // =========================

    @Column(name = "hospital_id", nullable = false)
    private Long hospitalId;

    // =========================
    // GALLERY IMAGES
    // =========================

    @OneToMany(
            mappedBy = "doctor",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<DoctorGallery> galleryImages = new ArrayList<>();

    // =========================
    // CONSTRUCTORS
    // =========================

    public Doctor() {
    }

    // =========================
    // GETTERS & SETTERS
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

    public Boolean getAvailable() {
        return available;
    }

    public void setAvailable(Boolean available) {
        this.available = available;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Long getHospitalId() {
        return hospitalId;
    }

    public void setHospitalId(Long hospitalId) {
        this.hospitalId = hospitalId;
    }

    public List<DoctorGallery> getGalleryImages() {
        return galleryImages;
    }

    public void setGalleryImages(
            List<DoctorGallery> galleryImages
    ) {
        this.galleryImages = galleryImages;
    }
}