package com.DoctorMs.DoctorMs.service;

import com.DoctorMs.DoctorMs.dto.DoctorRequestDto;
import com.DoctorMs.DoctorMs.dto.DoctorResponseDto;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface DoctorServiceInterface {

    // =========================
    // Create Doctor
    // =========================

    DoctorResponseDto createDoctor(
            DoctorRequestDto doctorRequestDto,
            MultipartFile profileImage,
            List<MultipartFile> galleryImages,
            Long hospitalId
    );


    // =========================
    // Get All Doctors
    // =========================

    List<DoctorResponseDto> getAllDoctors(
            Long hospitalId
    );


    // =========================
    // Get Doctor By ID
    // =========================

    DoctorResponseDto getDoctorById(
            Long id,
            Long hospitalId
    );


    // =========================
    // Update Doctor
    // =========================

    DoctorResponseDto updateDoctor(
            Long id,
            DoctorRequestDto doctorRequestDto,
            MultipartFile profileImage,
            List<MultipartFile> galleryImages,
            Long hospitalId
    );


    // =========================
    // Delete Doctor
    // =========================

    void deleteDoctor(
            Long id,
            Long hospitalId
    );


    // =========================
    // Delete Gallery Image
    // =========================

    void deleteGalleryImage(
            Long doctorId,
            Long galleryId,
            Long hospitalId
    );
}