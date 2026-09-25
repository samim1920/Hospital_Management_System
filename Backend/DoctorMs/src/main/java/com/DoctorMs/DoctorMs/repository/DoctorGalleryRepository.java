package com.DoctorMs.DoctorMs.repository;

import com.DoctorMs.DoctorMs.entity.DoctorGallery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorGalleryRepository extends JpaRepository<DoctorGallery, Long> {

    // Get all gallery images of a doctor belonging to a hospital
    List<DoctorGallery> findByDoctorIdAndHospitalId(
            Long doctorId,
            Long hospitalId
    );

    // Find one gallery image safely within the doctor + hospital
    Optional<DoctorGallery> findByIdAndDoctorIdAndHospitalId(
            Long id,
            Long doctorId,
            Long hospitalId
    );
}
