import AxiosInterceptor from "../Interceptor/AxiosInterceptor";

const PatientService = {

  // ==========================================
  // GET ALL PATIENTS
  // ==========================================

  getAllPatients: async () => {

    const response =
      await AxiosInterceptor.get(
        "/patient/all"
      );

    console.log(
      "========== PATIENT LIST =========="
    );

    console.log(response.data);

    return response.data;
  },


  // ==========================================
  // GET PATIENT BY ID
  // ==========================================

  getPatientById: async (id) => {

    const response =
      await AxiosInterceptor.get(
        `/patient/${id}`
      );

    return response.data;
  },


  // ==========================================
  // CREATE PATIENT
  // ==========================================

  createPatient: async (patientData) => {

    const response =
      await AxiosInterceptor.post(
        "/patient/create",
        patientData
      );

    console.log(
      "========== CREATE PATIENT =========="
    );

    console.log(response.data);

    return response.data;
  },


  // ==========================================
  // UPDATE PATIENT
  // ==========================================

  updatePatient: async (
    id,
    patientData
  ) => {

    const response =
      await AxiosInterceptor.put(
        `/patient/${id}`,
        patientData
      );

    console.log(
      "========== UPDATE PATIENT =========="
    );

    console.log(response.data);

    return response.data;
  },


  // ==========================================
  // DELETE PATIENT
  // ==========================================

  deletePatient: async (id) => {

    const response =
      await AxiosInterceptor.delete(
        `/patient/${id}`
      );

    console.log(
      "========== DELETE PATIENT =========="
    );

    console.log(response.data);

    return response.data;
  }

};

export default PatientService;