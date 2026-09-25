import AxiosInterceptor from "../Interceptor/AxiosInterceptor";

const AppointmentService = {

  getAllAppointments: async () => {
    const response = await AxiosInterceptor.get("/appointment/all");
    return response.data;
  },

  getAppointmentById: async (id) => {
    const response = await AxiosInterceptor.get(`/appointment/${id}`);
    return response.data;
  },

  createAppointment: async (appointmentData) => {
    const response = await AxiosInterceptor.post(
      "/appointment/create",
      appointmentData
    );

    return response.data;
  },

  updateAppointment: async (id, appointmentData) => {
    const response = await AxiosInterceptor.put(
      `/appointment/${id}`,
      appointmentData
    );

    return response.data;
  },

  deleteAppointment: async (id) => {
    const response = await AxiosInterceptor.delete(
      `/appointment/${id}`
    );

    return response.data;
  },

  markCashPaymentAsPaid: async (id) => {
    const response = await AxiosInterceptor.patch(
      `/appointment/${id}/cash-payment`
    );

    return response.data;
  },

  verifyOnlinePayment: async (appointmentId, paymentData) => {
    const response = await AxiosInterceptor.post(
      `/appointment/${appointmentId}/payment/verify`,
      paymentData
    );

    return response.data;
  },

  getAppointmentsByPatient: async (patientId) => {
    const response = await AxiosInterceptor.get(
      `/appointment/patient/${patientId}`
    );

    return response.data;
  },

  getAppointmentsByDoctor: async (doctorId) => {
    const response = await AxiosInterceptor.get(
      `/appointment/doctor/${doctorId}`
    );

    return response.data;
  },

  getAppointmentsByDoctorAndDate: async (doctorId, date) => {
    const response = await AxiosInterceptor.get(
      `/appointment/doctor/${doctorId}/date/${date}`
    );

    return response.data;
  }
};

export default AppointmentService;