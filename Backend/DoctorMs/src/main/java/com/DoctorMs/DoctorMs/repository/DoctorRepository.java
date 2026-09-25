package com.DoctorMs.DoctorMs.repository;

import com.DoctorMs.DoctorMs.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository
        extends JpaRepository<Doctor, Long> {

        // Get all doctors belonging to a hospital
        List<Doctor> findByHospitalId(Long hospitalId);

        // Check whether doctor ID already exists in this hospital
        boolean existsByDoctoridAndHospitalId(
                String doctorid,
                Long hospitalId
        );

        // Find doctor only within the current hospital
        Optional<Doctor> findByIdAndHospitalId(
                Long id,
                Long hospitalId
        );
}