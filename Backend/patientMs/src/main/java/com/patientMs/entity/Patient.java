package com.patientMs.entity;

import jakarta.persistence.*;

@Entity
@Table(
        name = "patients",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_patient_hospital",
                        columnNames = {"patient_id", "hospital_id"}
                )
        }
)
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Patient ID shown in UI: P00004
    @Column(
            name = "patient_id",
            nullable = false
    )
    private String patientId;

    // Full Name
    @Column(nullable = false)
    private String name;

    // Age
    @Column(nullable = false)
    private Integer age;

    // Male / Female / Other
    @Column(nullable = false)
    private String gender;

    // Phone Number
    @Column(nullable = false)
    private String phone;

    // General Medicine / Cardiology / Neurology etc.
    @Column(nullable = false)
    private String department;

    // ADMITTED / DISCHARGED / CONSULTATION
    @Column(nullable = false)
    private String status;

    // Logged-in hospital
    @Column(
            name = "hospital_id",
            nullable = false
    )
    private Long hospitalId;


    // =========================
    // GETTERS & SETTERS
    // =========================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPatientId() {
        return patientId;
    }

    public void setPatientId(String patientId) {
        this.patientId = patientId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Long getHospitalId() {
        return hospitalId;
    }

    public void setHospitalId(Long hospitalId) {
        this.hospitalId = hospitalId;
    }
}