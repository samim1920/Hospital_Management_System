package com.example.AppointmentMs.service;

import com.example.AppointmentMs.dto.AppointmentRequestDto;
import com.example.AppointmentMs.dto.AppointmentResponseDto;
import com.example.AppointmentMs.entity.Appointment;
import com.example.AppointmentMs.repository.AppointmentRepository;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.List;

@Service
public class AppointmentServiceImpl implements AppointmentServiceInterface {

    private final AppointmentRepository appointmentRepository;
    private final RestTemplate restTemplate;
    private final RazorpayService razorpayService;

    private static final String DOCTOR_SERVICE_URL =
            "http://localhost:8081/doctor/";

    public AppointmentServiceImpl(
            AppointmentRepository appointmentRepository,
            RestTemplate restTemplate,
            RazorpayService razorpayService
    ) {
        this.appointmentRepository = appointmentRepository;
        this.restTemplate = restTemplate;
        this.razorpayService = razorpayService;
    }


    // =========================================================
    // CREATE APPOINTMENT
    // =========================================================

    @Override
    public AppointmentResponseDto createAppointment(
            AppointmentRequestDto requestDto,
            Long hospitalId
    ) {

        if (hospitalId == null) {
            throw new RuntimeException("Hospital ID is required");
        }

        if (requestDto.getPatientId() == null) {
            throw new RuntimeException("Patient ID is required");
        }

        if (requestDto.getDoctorId() == null) {
            throw new RuntimeException("Doctor ID is required");
        }

        if (requestDto.getAppointmentDate() == null) {
            throw new RuntimeException("Appointment date is required");
        }

        if (requestDto.getAppointmentTime() == null) {
            throw new RuntimeException("Appointment time is required");
        }

        if (requestDto.getPaymentMethod() == null) {
            throw new RuntimeException("Payment method is required");
        }


        // =====================================================
        // GET DOCTOR FROM DOCTOR MS
        // =====================================================

        DoctorResponse doctor = getDoctor(
                requestDto.getDoctorId(),
                hospitalId
        );

        if (doctor == null) {
            throw new RuntimeException("Doctor not found");
        }


        // =====================================================
        // GENERATE TOKEN
        // =====================================================

        Integer tokenNumber = generateToken(
                requestDto.getDoctorId(),
                requestDto.getAppointmentDate(),
                hospitalId
        );


        // =====================================================
        // CREATE APPOINTMENT
        // =====================================================

        Appointment appointment = new Appointment();

        appointment.setPatientId(requestDto.getPatientId());
        appointment.setPatientName(requestDto.getPatientName());

        appointment.setDoctorId(doctor.getId());
        appointment.setDoctorName(doctor.getDoctorname());
        appointment.setDepartment(doctor.getDepartment());

        appointment.setAppointmentDate(
                requestDto.getAppointmentDate()
        );

        appointment.setAppointmentTime(
                requestDto.getAppointmentTime()
        );

        appointment.setTokenNumber(tokenNumber);

        appointment.setReason(requestDto.getReason());


        // =====================================================
        // PAYMENT
        // =====================================================

        appointment.setPaymentMethod(
                requestDto.getPaymentMethod()
        );

        // IMPORTANT:
        // Payment amount comes from DoctorMs.
        appointment.setPaymentAmount(
                doctor.getConsultationFee()
        );

        // Every new appointment starts as PENDING.
        appointment.setPaymentStatus(
                Appointment.PaymentStatus.PENDING
        );

        appointment.setHospitalId(hospitalId);


        // =====================================================
        // SAVE APPOINTMENT FIRST
        // =====================================================

        Appointment savedAppointment =
                appointmentRepository.save(appointment);


        // =====================================================
        // ONLINE PAYMENT
        // =====================================================

        if (requestDto.getPaymentMethod()
                == Appointment.PaymentMethod.ONLINE) {

            String receipt =
                    "appointment_" + savedAppointment.getId();

            String razorpayOrderId =
                    razorpayService.createOrder(
                            savedAppointment.getPaymentAmount(),
                            receipt
                    );

            savedAppointment.setRazorpayOrderId(
                    razorpayOrderId
            );

            savedAppointment =
                    appointmentRepository.save(savedAppointment);
        }


        // =====================================================
        // RETURN RESPONSE
        // =====================================================

        return convertToResponse(savedAppointment);
    }


    // =========================================================
    // GET ALL APPOINTMENTS
    // =========================================================

    @Override
    public List<AppointmentResponseDto> getAllAppointments(
            Long hospitalId
    ) {

        return appointmentRepository
                .findByHospitalIdOrderByAppointmentDateAscAppointmentTimeAsc(
                        hospitalId
                )
                .stream()
                .map(this::convertToResponse)
                .toList();
    }


    // =========================================================
    // GET APPOINTMENT BY ID
    // =========================================================

    @Override
    public AppointmentResponseDto getAppointmentById(
            Long id,
            Long hospitalId
    ) {

        Appointment appointment =
                appointmentRepository
                        .findByIdAndHospitalId(id, hospitalId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Appointment not found"
                                )
                        );

        return convertToResponse(appointment);
    }


    // =========================================================
    // GET PATIENT APPOINTMENTS
    // =========================================================

    @Override
    public List<AppointmentResponseDto> getAppointmentsByPatient(
            Long patientId,
            Long hospitalId
    ) {

        return appointmentRepository
                .findByPatientIdAndHospitalIdOrderByAppointmentDateAscAppointmentTimeAsc(
                        patientId,
                        hospitalId
                )
                .stream()
                .map(this::convertToResponse)
                .toList();
    }


    // =========================================================
    // GET DOCTOR APPOINTMENTS
    // =========================================================

    @Override
    public List<AppointmentResponseDto> getAppointmentsByDoctor(
            Long doctorId,
            Long hospitalId
    ) {

        return appointmentRepository
                .findByDoctorIdAndHospitalIdOrderByAppointmentDateAscAppointmentTimeAsc(
                        doctorId,
                        hospitalId
                )
                .stream()
                .map(this::convertToResponse)
                .toList();
    }


    // =========================================================
    // GET DOCTOR APPOINTMENTS BY DATE
    // =========================================================

    @Override
    public List<AppointmentResponseDto> getAppointmentsByDoctorAndDate(
            Long doctorId,
            LocalDate date,
            Long hospitalId
    ) {

        return appointmentRepository
                .findByDoctorIdAndAppointmentDateAndHospitalIdOrderByTokenNumberAsc(
                        doctorId,
                        date,
                        hospitalId
                )
                .stream()
                .map(this::convertToResponse)
                .toList();
    }


    // =========================================================
    // UPDATE APPOINTMENT
    // =========================================================

    @Override
    public AppointmentResponseDto updateAppointment(
            Long id,
            AppointmentRequestDto requestDto,
            Long hospitalId
    ) {

        Appointment appointment =
                appointmentRepository
                        .findByIdAndHospitalId(id, hospitalId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Appointment not found"
                                )
                        );


        if (requestDto.getDoctorId() != null &&
                !requestDto.getDoctorId()
                        .equals(appointment.getDoctorId())) {

            DoctorResponse doctor =
                    getDoctor(
                            requestDto.getDoctorId(),
                            hospitalId
                    );

            appointment.setDoctorId(doctor.getId());
            appointment.setDoctorName(doctor.getDoctorname());
            appointment.setDepartment(doctor.getDepartment());

            appointment.setPaymentAmount(
                    doctor.getConsultationFee()
            );

            LocalDate date =
                    requestDto.getAppointmentDate() != null
                            ? requestDto.getAppointmentDate()
                            : appointment.getAppointmentDate();

            appointment.setTokenNumber(
                    generateToken(
                            requestDto.getDoctorId(),
                            date,
                            hospitalId
                    )
            );
        }


        if (requestDto.getPatientId() != null) {
            appointment.setPatientId(
                    requestDto.getPatientId()
            );
        }

        if (requestDto.getPatientName() != null) {
            appointment.setPatientName(
                    requestDto.getPatientName()
            );
        }

        if (requestDto.getAppointmentDate() != null) {
            appointment.setAppointmentDate(
                    requestDto.getAppointmentDate()
            );
        }

        if (requestDto.getAppointmentTime() != null) {
            appointment.setAppointmentTime(
                    requestDto.getAppointmentTime()
            );
        }

        if (requestDto.getReason() != null) {
            appointment.setReason(
                    requestDto.getReason()
            );
        }

        if (requestDto.getPaymentMethod() != null) {
            appointment.setPaymentMethod(
                    requestDto.getPaymentMethod()
            );
        }


        Appointment updatedAppointment =
                appointmentRepository.save(appointment);

        return convertToResponse(updatedAppointment);
    }


    // =========================================================
    // DELETE APPOINTMENT
    // =========================================================

    @Override
    public void deleteAppointment(
            Long id,
            Long hospitalId
    ) {

        Appointment appointment =
                appointmentRepository
                        .findByIdAndHospitalId(id, hospitalId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Appointment not found"
                                )
                        );

        appointmentRepository.delete(appointment);
    }


    // =========================================================
    // MARK CASH PAYMENT AS PAID
    // =========================================================

    @Override
    public AppointmentResponseDto markCashPaymentAsPaid(
            Long id,
            Long hospitalId
    ) {

        Appointment appointment =
                appointmentRepository
                        .findByIdAndHospitalId(id, hospitalId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Appointment not found"
                                )
                        );

        if (appointment.getPaymentMethod()
                != Appointment.PaymentMethod.CASH) {

            throw new RuntimeException(
                    "This appointment is not a cash payment"
            );
        }

        appointment.setPaymentStatus(
                Appointment.PaymentStatus.PAID
        );

        Appointment updatedAppointment =
                appointmentRepository.save(appointment);

        return convertToResponse(updatedAppointment);
    }


    // =========================================================
    // VERIFY ONLINE PAYMENT
    // =========================================================

    @Override
    public AppointmentResponseDto verifyOnlinePayment(
            Long appointmentId,
            String razorpayOrderId,
            String razorpayPaymentId,
            String razorpaySignature,
            Long hospitalId
    ) {

        Appointment appointment =
                appointmentRepository
                        .findByIdAndHospitalId(
                                appointmentId,
                                hospitalId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Appointment not found"
                                )
                        );


        if (appointment.getPaymentMethod()
                != Appointment.PaymentMethod.ONLINE) {

            throw new RuntimeException(
                    "This appointment is not an online payment"
            );
        }


        // Make sure the order belongs to this appointment
        if (appointment.getRazorpayOrderId() == null ||
                !appointment.getRazorpayOrderId()
                        .equals(razorpayOrderId)) {

            throw new RuntimeException(
                    "Invalid Razorpay Order ID"
            );
        }


        // =====================================================
        // VERIFY RAZORPAY SIGNATURE
        // =====================================================

        boolean verified =
                razorpayService.verifyPaymentSignature(
                        razorpayOrderId,
                        razorpayPaymentId,
                        razorpaySignature
                );


        if (!verified) {

            throw new RuntimeException(
                    "Razorpay payment verification failed"
            );
        }


        // =====================================================
        // PAYMENT SUCCESS
        // =====================================================

        appointment.setRazorpayPaymentId(
                razorpayPaymentId
        );

        appointment.setPaymentStatus(
                Appointment.PaymentStatus.PAID
        );


        Appointment updatedAppointment =
                appointmentRepository.save(appointment);

        return convertToResponse(updatedAppointment);
    }


    // =========================================================
    // GENERATE TOKEN
    // =========================================================

    private Integer generateToken(
            Long doctorId,
            LocalDate appointmentDate,
            Long hospitalId
    ) {

        return appointmentRepository
                .findTopByDoctorIdAndAppointmentDateAndHospitalIdOrderByTokenNumberDesc(
                        doctorId,
                        appointmentDate,
                        hospitalId
                )
                .map(appointment ->
                        appointment.getTokenNumber() + 1
                )
                .orElse(1);
    }


    // =========================================================
    // GET DOCTOR FROM DOCTOR MS
    // =========================================================

    private DoctorResponse getDoctor(
            Long doctorId,
            Long hospitalId
    ) {

        String url =
                DOCTOR_SERVICE_URL + doctorId;

        HttpHeaders headers = new HttpHeaders();

        headers.set(
                "X-Hospital-Id",
                String.valueOf(hospitalId)
        );

        HttpEntity<Void> entity =
                new HttpEntity<>(headers);

        ResponseEntity<DoctorResponse> response =
                restTemplate.exchange(
                        url,
                        HttpMethod.GET,
                        entity,
                        DoctorResponse.class
                );

        if (!response.getStatusCode().is2xxSuccessful()
                || response.getBody() == null) {

            throw new RuntimeException(
                    "Unable to fetch doctor details"
            );
        }

        return response.getBody();
    }


    // =========================================================
    // ENTITY → RESPONSE DTO
    // =========================================================

    private AppointmentResponseDto convertToResponse(
            Appointment appointment
    ) {

        AppointmentResponseDto response =
                new AppointmentResponseDto();

        response.setId(appointment.getId());

        response.setPatientId(
                appointment.getPatientId()
        );

        response.setPatientName(
                appointment.getPatientName()
        );

        response.setDoctorId(
                appointment.getDoctorId()
        );

        response.setDoctorName(
                appointment.getDoctorName()
        );

        response.setDepartment(
                appointment.getDepartment()
        );

        response.setAppointmentDate(
                appointment.getAppointmentDate()
        );

        response.setAppointmentTime(
                appointment.getAppointmentTime()
        );

        response.setTokenNumber(
                appointment.getTokenNumber()
        );

        response.setReason(
                appointment.getReason()
        );

        // Payment
        response.setPaymentMethod(
                appointment.getPaymentMethod()
        );

        response.setPaymentAmount(
                appointment.getPaymentAmount()
        );

        response.setPaymentStatus(
                appointment.getPaymentStatus()
        );

        // Razorpay
        response.setRazorpayOrderId(
                appointment.getRazorpayOrderId()
        );

        response.setRazorpayPaymentId(
                appointment.getRazorpayPaymentId()
        );

        // Hospital
        response.setHospitalId(
                appointment.getHospitalId()
        );


        // =====================================================
        // CALCULATED APPOINTMENT STATUS
        // =====================================================

        if (appointment.getPaymentStatus()
                == Appointment.PaymentStatus.PAID) {

            response.setStatus("COMPLETED");

        } else {

            response.setStatus("PENDING");
        }

        return response;
    }


    // =========================================================
    // INTERNAL DOCTOR RESPONSE
    // =========================================================

    private static class DoctorResponse {

        private Long id;
        private String doctorname;
        private String department;
        private Double consultationFee;

        public DoctorResponse() {
        }

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

        public String getDepartment() {
            return department;
        }

        public void setDepartment(String department) {
            this.department = department;
        }

        public Double getConsultationFee() {
            return consultationFee;
        }

        public void setConsultationFee(Double consultationFee) {
            this.consultationFee = consultationFee;
        }
    }
}