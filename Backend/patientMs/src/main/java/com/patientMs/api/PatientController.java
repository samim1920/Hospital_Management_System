package com.patientMs.api;

import com.patientMs.dto.PatientRequestDto;
import com.patientMs.dto.PatientResponseDto;
import com.PatientMs.PatientMs.service.PatientServiceInterface;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/patient")
public class PatientController {

    private final PatientServiceInterface patientService;

    public PatientController(
            PatientServiceInterface patientService
    ) {
        this.patientService = patientService;
    }

    // =========================
    // CREATE PATIENT
    // =========================

    @PostMapping("/create")
    public ResponseEntity<PatientResponseDto> createPatient(

            @RequestBody PatientRequestDto patientRequestDto,

            @RequestHeader("X-Hospital-Id")
            Long hospitalId

    ) {

        PatientResponseDto response =
                patientService.createPatient(
                        patientRequestDto,
                        hospitalId
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }


    // =========================
    // GET ALL PATIENTS
    // =========================

    @GetMapping("/all")
    public ResponseEntity<List<PatientResponseDto>> getAllPatients(

            @RequestHeader("X-Hospital-Id")
            Long hospitalId

    ) {

        return ResponseEntity.ok(
                patientService.getAllPatients(
                        hospitalId
                )
        );
    }


    // =========================
    // GET PATIENT BY ID
    // =========================

    @GetMapping("/{id}")
    public ResponseEntity<PatientResponseDto> getPatientById(

            @PathVariable Long id,

            @RequestHeader("X-Hospital-Id")
            Long hospitalId

    ) {

        return ResponseEntity.ok(
                patientService.getPatientById(
                        id,
                        hospitalId
                )
        );
    }


    // =========================
    // UPDATE PATIENT
    // =========================

    @PutMapping("/{id}")
    public ResponseEntity<PatientResponseDto> updatePatient(

            @PathVariable Long id,

            @RequestBody PatientRequestDto patientRequestDto,

            @RequestHeader("X-Hospital-Id")
            Long hospitalId

    ) {

        PatientResponseDto response =
                patientService.updatePatient(
                        id,
                        patientRequestDto,
                        hospitalId
                );

        return ResponseEntity.ok(response);
    }


    // =========================
    // DELETE PATIENT
    // =========================

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePatient(

            @PathVariable Long id,

            @RequestHeader("X-Hospital-Id")
            Long hospitalId

    ) {

        patientService.deletePatient(
                id,
                hospitalId
        );

        return ResponseEntity.ok(
                "Patient deleted successfully"
        );
    }
}
