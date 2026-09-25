package com.DoctorMs.DoctorMs.api;

import com.DoctorMs.DoctorMs.dto.DoctorRequestDto;
import com.DoctorMs.DoctorMs.dto.DoctorResponseDto;
import com.DoctorMs.DoctorMs.service.DoctorServiceInterface;

import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/doctor")
public class DoctorController {

    private final DoctorServiceInterface doctorService;
    private final ObjectMapper objectMapper;

    public DoctorController(
            DoctorServiceInterface doctorService,
            ObjectMapper objectMapper
    ) {
        this.doctorService = doctorService;
        this.objectMapper = objectMapper;
    }


    // =====================================================
    // CREATE DOCTOR
    // POST: /doctor/create
    // =====================================================

    @PostMapping(
            value = "/create",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<DoctorResponseDto> createDoctor(

            @RequestPart("doctor")
            String doctorJson,

            // Profile image
            @RequestPart(
                    value = "image",
                    required = false
            )
            MultipartFile image,

            // Multiple gallery images
            @RequestPart(
                    value = "galleryImages",
                    required = false
            )
            List<MultipartFile> galleryImages,

            @RequestHeader("X-Hospital-Id")
            Long hospitalId

    ) throws Exception {

        DoctorRequestDto doctorRequestDto =
                objectMapper.readValue(
                        doctorJson,
                        DoctorRequestDto.class
                );

        DoctorResponseDto response =
                doctorService.createDoctor(
                        doctorRequestDto,
                        image,
                        galleryImages,
                        hospitalId
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }


    // =====================================================
    // GET DOCTOR BY ID
    // GET: /doctor/{id}
    // =====================================================

    @GetMapping("/{id}")
    public ResponseEntity<DoctorResponseDto> getDoctorById(

            @PathVariable Long id,

            @RequestHeader("X-Hospital-Id")
            Long hospitalId

    ) {

        DoctorResponseDto response =
                doctorService.getDoctorById(
                        id,
                        hospitalId
                );

        return ResponseEntity.ok(response);
    }


    // =====================================================
    // GET ALL DOCTORS
    // GET: /doctor/all
    // =====================================================

    @GetMapping("/all")
    public ResponseEntity<List<DoctorResponseDto>> getAllDoctors(

            @RequestHeader("X-Hospital-Id")
            Long hospitalId

    ) {

        return ResponseEntity.ok(
                doctorService.getAllDoctors(
                        hospitalId
                )
        );
    }


    // =====================================================
    // UPDATE DOCTOR
    // PUT: /doctor/{id}
    // =====================================================

    @PutMapping(
            value = "/{id}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<DoctorResponseDto> updateDoctor(

            @PathVariable Long id,

            @RequestPart("doctor")
            String doctorJson,

            // New profile image
            @RequestPart(
                    value = "image",
                    required = false
            )
            MultipartFile image,

            // New gallery images
            @RequestPart(
                    value = "galleryImages",
                    required = false
            )
            List<MultipartFile> galleryImages,

            @RequestHeader("X-Hospital-Id")
            Long hospitalId

    ) throws Exception {

        DoctorRequestDto doctorRequestDto =
                objectMapper.readValue(
                        doctorJson,
                        DoctorRequestDto.class
                );

        DoctorResponseDto response =
                doctorService.updateDoctor(
                        id,
                        doctorRequestDto,
                        image,
                        galleryImages,
                        hospitalId
                );

        return ResponseEntity.ok(response);
    }


    // =====================================================
    // DELETE DOCTOR
    // DELETE: /doctor/{id}
    // =====================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteDoctor(

            @PathVariable Long id,

            @RequestHeader("X-Hospital-Id")
            Long hospitalId

    ) {

        doctorService.deleteDoctor(
                id,
                hospitalId
        );

        return ResponseEntity.ok(
                "Doctor deleted successfully"
        );
    }


    // =====================================================
    // DELETE GALLERY IMAGE
    // DELETE: /doctor/{doctorId}/gallery/{galleryId}
    // =====================================================

    @DeleteMapping("/{doctorId}/gallery/{galleryId}")
    public ResponseEntity<String> deleteGalleryImage(

            @PathVariable Long doctorId,

            @PathVariable Long galleryId,

            @RequestHeader("X-Hospital-Id")
            Long hospitalId

    ) {

        doctorService.deleteGalleryImage(
                doctorId,
                galleryId,
                hospitalId
        );

        return ResponseEntity.ok(
                "Gallery image deleted successfully"
        );
    }
}