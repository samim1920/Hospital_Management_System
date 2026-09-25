package com.DoctorMs.DoctorMs.service;

import com.DoctorMs.DoctorMs.dto.DoctorGalleryResponseDto;
import com.DoctorMs.DoctorMs.dto.DoctorRequestDto;
import com.DoctorMs.DoctorMs.dto.DoctorResponseDto;
import com.DoctorMs.DoctorMs.entity.Doctor;
import com.DoctorMs.DoctorMs.entity.DoctorGallery;
import com.DoctorMs.DoctorMs.repository.DoctorGalleryRepository;
import com.DoctorMs.DoctorMs.repository.DoctorRepository;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Service
public class DoctorServiceImpl implements DoctorServiceInterface {

    private final DoctorRepository doctorRepository;
    private final DoctorGalleryRepository doctorGalleryRepository;
    private final Cloudinary cloudinary;


    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public DoctorServiceImpl(
            DoctorRepository doctorRepository,
            DoctorGalleryRepository doctorGalleryRepository,
            Cloudinary cloudinary
    ) {
        this.doctorRepository = doctorRepository;
        this.doctorGalleryRepository = doctorGalleryRepository;
        this.cloudinary = cloudinary;
    }


    // =========================================================
    // CREATE DOCTOR
    // =========================================================

    @Override
    public DoctorResponseDto createDoctor(
            DoctorRequestDto doctorRequestDto,
            MultipartFile profileImage,
            List<MultipartFile> galleryImages,
            Long hospitalId
    ) {

        // Check duplicate doctor ID within same hospital
        if (doctorRepository.existsByDoctoridAndHospitalId(
                doctorRequestDto.getDoctorid(),
                hospitalId
        )) {
            throw new RuntimeException(
                    "Doctor ID already exists in this hospital"
            );
        }


        // Create Doctor entity
        Doctor doctor = new Doctor();

        doctor.setDoctorname(
                doctorRequestDto.getDoctorname()
        );

        doctor.setDoctorid(
                doctorRequestDto.getDoctorid()
        );

        doctor.setEmail(
                doctorRequestDto.getEmail()
        );

        doctor.setPhone(
                doctorRequestDto.getPhone()
        );

        doctor.setDepartment(
                doctorRequestDto.getDepartment()
        );

        doctor.setExperience(
                doctorRequestDto.getExperience()
        );

        doctor.setQualification(
                doctorRequestDto.getQualification()
        );

        doctor.setBio(
                doctorRequestDto.getBio()
        );

        doctor.setRating(
                doctorRequestDto.getRating()
        );

        doctor.setConsultationFee(
                doctorRequestDto.getConsultationFee()
        );

        doctor.setAvailable(
                doctorRequestDto.getAvailable()
        );

        // Hospital ID comes from Gateway
        doctor.setHospitalId(hospitalId);


        // =====================================================
        // PROFILE IMAGE
        // =====================================================

        if (profileImage != null && !profileImage.isEmpty()) {

            String profileImageUrl =
                    uploadImage(profileImage);

            doctor.setImageUrl(profileImageUrl);
        }


        // Save doctor first
        Doctor savedDoctor =
                doctorRepository.save(doctor);


        // =====================================================
        // GALLERY IMAGES
        // =====================================================

        if (galleryImages != null &&
                !galleryImages.isEmpty()) {

            for (MultipartFile file : galleryImages) {

                if (file == null || file.isEmpty()) {
                    continue;
                }

                String galleryImageUrl =
                        uploadImage(file);

                DoctorGallery gallery =
                        new DoctorGallery();

                gallery.setImageUrl(
                        galleryImageUrl
                );

                gallery.setDoctor(
                        savedDoctor
                );

                gallery.setHospitalId(
                        hospitalId
                );

                doctorGalleryRepository.save(
                        gallery
                );
            }
        }


        return convertToResponse(savedDoctor);
    }


    // =========================================================
    // GET ALL DOCTORS
    // =========================================================

    @Override
    public List<DoctorResponseDto> getAllDoctors(
            Long hospitalId
    ) {

        List<Doctor> doctors =
                doctorRepository.findByHospitalId(
                        hospitalId
                );

        List<DoctorResponseDto> responseList =
                new ArrayList<>();

        for (Doctor doctor : doctors) {

            responseList.add(
                    convertToResponse(doctor)
            );
        }

        return responseList;
    }


    // =========================================================
    // GET DOCTOR BY ID
    // =========================================================

    @Override
    public DoctorResponseDto getDoctorById(
            Long id,
            Long hospitalId
    ) {

        Doctor doctor =
                doctorRepository
                        .findByIdAndHospitalId(
                                id,
                                hospitalId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Doctor not found"
                                )
                        );

        return convertToResponse(doctor);
    }


    // =========================================================
    // UPDATE DOCTOR
    // =========================================================

    @Override
    public DoctorResponseDto updateDoctor(
            Long id,
            DoctorRequestDto doctorRequestDto,
            MultipartFile profileImage,
            List<MultipartFile> galleryImages,
            Long hospitalId
    ) {

        Doctor doctor =
                doctorRepository
                        .findByIdAndHospitalId(
                                id,
                                hospitalId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Doctor not found"
                                )
                        );


        // =====================================================
        // UPDATE BASIC DETAILS
        // =====================================================

        doctor.setDoctorname(
                doctorRequestDto.getDoctorname()
        );

        doctor.setDoctorid(
                doctorRequestDto.getDoctorid()
        );

        doctor.setEmail(
                doctorRequestDto.getEmail()
        );

        doctor.setPhone(
                doctorRequestDto.getPhone()
        );

        doctor.setDepartment(
                doctorRequestDto.getDepartment()
        );

        doctor.setExperience(
                doctorRequestDto.getExperience()
        );

        doctor.setQualification(
                doctorRequestDto.getQualification()
        );

        doctor.setBio(
                doctorRequestDto.getBio()
        );

        doctor.setRating(
                doctorRequestDto.getRating()
        );

        doctor.setConsultationFee(
                doctorRequestDto.getConsultationFee()
        );

        doctor.setAvailable(
                doctorRequestDto.getAvailable()
        );


        // =====================================================
        // UPDATE PROFILE IMAGE
        // =====================================================

        if (profileImage != null &&
                !profileImage.isEmpty()) {

            String profileImageUrl =
                    uploadImage(profileImage);

            doctor.setImageUrl(
                    profileImageUrl
            );
        }


        // Save updated doctor
        Doctor updatedDoctor =
                doctorRepository.save(doctor);


        // =====================================================
        // ADD NEW GALLERY IMAGES
        // =====================================================

        if (galleryImages != null &&
                !galleryImages.isEmpty()) {

            for (MultipartFile file : galleryImages) {

                if (file == null || file.isEmpty()) {
                    continue;
                }

                String galleryImageUrl =
                        uploadImage(file);

                DoctorGallery gallery =
                        new DoctorGallery();

                gallery.setImageUrl(
                        galleryImageUrl
                );

                gallery.setDoctor(
                        updatedDoctor
                );

                gallery.setHospitalId(
                        hospitalId
                );

                doctorGalleryRepository.save(
                        gallery
                );
            }
        }


        return convertToResponse(updatedDoctor);
    }


    // =========================================================
    // DELETE DOCTOR
    // =========================================================

    @Override
    public void deleteDoctor(
            Long id,
            Long hospitalId
    ) {

        Doctor doctor =
                doctorRepository
                        .findByIdAndHospitalId(
                                id,
                                hospitalId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Doctor not found"
                                )
                        );

        doctorRepository.delete(doctor);
    }


    // =========================================================
    // DELETE GALLERY IMAGE
    // =========================================================

    @Override
    public void deleteGalleryImage(
            Long doctorId,
            Long galleryId,
            Long hospitalId
    ) {

        // Verify doctor belongs to hospital
        doctorRepository
                .findByIdAndHospitalId(
                        doctorId,
                        hospitalId
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Doctor not found"
                        )
                );


        // Find gallery image
        DoctorGallery gallery =
                doctorGalleryRepository
                        .findByIdAndDoctorIdAndHospitalId(
                                galleryId,
                                doctorId,
                                hospitalId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Gallery image not found"
                                )
                        );


        doctorGalleryRepository.delete(
                gallery
        );
    }


    // =========================================================
    // ENTITY → RESPONSE DTO
    // =========================================================

    private DoctorResponseDto convertToResponse(
            Doctor doctor
    ) {

        List<DoctorGalleryResponseDto>
                galleryResponseList =
                new ArrayList<>();


        // Get gallery images
        List<DoctorGallery> galleryImages =
                doctorGalleryRepository
                        .findByDoctorIdAndHospitalId(
                                doctor.getId(),
                                doctor.getHospitalId()
                        );


        for (DoctorGallery gallery :
                galleryImages) {

            DoctorGalleryResponseDto galleryDto =
                    new DoctorGalleryResponseDto();

            galleryDto.setId(
                    gallery.getId()
            );

            galleryDto.setImageUrl(
                    gallery.getImageUrl()
            );

            galleryResponseList.add(
                    galleryDto
            );
        }


        // Create response
        return new DoctorResponseDto(

                doctor.getId(),

                doctor.getDoctorname(),

                doctor.getDoctorid(),

                doctor.getEmail(),

                doctor.getPhone(),

                doctor.getDepartment(),

                doctor.getExperience(),

                doctor.getQualification(),

                doctor.getBio(),

                doctor.getRating(),

                doctor.getConsultationFee(),

                doctor.getImageUrl(),

                doctor.getAvailable(),

                galleryResponseList
        );
    }


    // =========================================================
    // CLOUDINARY IMAGE UPLOAD
    // =========================================================

    private String uploadImage(
            MultipartFile file
    ) {

        try {

            if (file == null ||
                    file.isEmpty()) {

                throw new RuntimeException(
                        "Image file is empty"
                );
            }


            // Upload to Cloudinary
            var uploadResult =
                    cloudinary.uploader().upload(
                            file.getBytes(),
                            ObjectUtils.asMap(
                                    "resource_type",
                                    "image",

                                    "folder",
                                    "hospital-management/doctors"
                            )
                    );


            Object secureUrl =
                    uploadResult.get("secure_url");


            if (secureUrl == null) {

                throw new RuntimeException(
                        "Cloudinary did not return image URL"
                );
            }


            return secureUrl.toString();

        } catch (Exception e) {

            throw new RuntimeException(
                    "Failed to upload image to Cloudinary",
                    e
            );
        }
    }
}