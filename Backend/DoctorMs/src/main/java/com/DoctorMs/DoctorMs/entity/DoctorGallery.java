package com.DoctorMs.DoctorMs.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "doctor_gallery")
public class DoctorGallery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "image_url", nullable = false)
    private String imageUrl;

    // Many gallery images belong to one doctor
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    // Hospital ownership
    @Column(name = "hospital_id", nullable = false)
    private Long hospitalId;


    // =========================
    // Constructors
    // =========================

    public DoctorGallery() {
    }

    public DoctorGallery(String imageUrl, Doctor doctor, Long hospitalId) {
        this.imageUrl = imageUrl;
        this.doctor = doctor;
        this.hospitalId = hospitalId;
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

    public Doctor getDoctor() {
        return doctor;
    }

    public void setDoctor(Doctor doctor) {
        this.doctor = doctor;
    }

    public Long getHospitalId() {
        return hospitalId;
    }

    public void setHospitalId(Long hospitalId) {
        this.hospitalId = hospitalId;
    }
}
