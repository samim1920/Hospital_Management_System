import AxiosInterceptor from "../Interceptor/AxiosInterceptor";

const AuthService = {

  // ==========================================
  // LOGIN
  // ==========================================

  login: async (loginData) => {

    const response = await AxiosInterceptor.post(
      "/user/login",
      loginData
    );

    const data = response.data;

    console.log("========== LOGIN RESPONSE ==========");
    console.log("Token:", data.token);
    console.log("Hospital ID:", data.hospitalId);
    console.log("Hospital Name:", data.hospitalName);
    console.log("Admin Name:", data.adminName);

    // Save JWT
    localStorage.setItem(
      "token",
      data.token
    );

    // Save hospital ID
    if (data.hospitalId) {
      localStorage.setItem(
        "hospitalId",
        data.hospitalId
      );
    }

    // Save hospital name
    localStorage.setItem(
      "hospitalName",
      data.hospitalName
    );

    // Save admin name
    localStorage.setItem(
      "adminName",
      data.adminName
    );

    return data;
  },


  // ==========================================
  // SEND REGISTER OTP
  // ==========================================

  sendRegisterOtp: async (userData) => {

    const response =
      await AxiosInterceptor.post(
        "/user/register/send-otp",
        userData
      );

    console.log(
      "========== SEND OTP RESPONSE =========="
    );

    console.log(
      response.data
    );

    return response.data;
  },


  // ==========================================
  // VERIFY REGISTER OTP
  // ==========================================

  verifyRegisterOtp: async (
    email,
    otp
  ) => {

    const response =
      await AxiosInterceptor.post(
        "/user/register/verify-otp",
        {
          email,
          otp
        }
      );

    console.log(
      "========== VERIFY OTP RESPONSE =========="
    );

    console.log(
      response.data
    );

    return response.data;
  }

};

export default AuthService;