import axios from "axios";

// ==========================================
// Axios Instance
// ==========================================

import axios from "axios";

const AxiosInterceptor = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:9090",
});



// ==========================================
// PUBLIC ENDPOINTS
// ==========================================

const publicEndpoints = [
  "/user/login",
  "/user/test",
  "/user/register/send-otp",
  "/user/register/verify-otp",
];


// ==========================================
// REQUEST INTERCEPTOR
// ==========================================

AxiosInterceptor.interceptors.request.use(
  (config) => {

    const token = localStorage.getItem("token");

    // Remove query parameters
    const requestPath =
      config.url?.split("?")[0];

    const isPublicEndpoint =
      publicEndpoints.includes(requestPath);


    // ========================================
    // JWT
    // ========================================

    if (token && !isPublicEndpoint) {

      config.headers.Authorization =
        `Bearer ${token}`;

    }


    // ========================================
    // CONTENT TYPE
    // ========================================

    if (config.data instanceof FormData) {

      // Let browser set:
      // multipart/form-data; boundary=...

      delete config.headers["Content-Type"];
      delete config.headers["content-type"];

    } else {

      config.headers["Content-Type"] =
        "application/json";

    }


    // ========================================
    // DEBUG
    // ========================================

    console.log("➡️ Axios Request");

    console.log(
      "Method:",
      config.method?.toUpperCase()
    );

    console.log(
      "URL:",
      `${config.baseURL}${config.url}`
    );

    console.log(
      "Public:",
      isPublicEndpoint
    );

    console.log(
      "Authorization:",
      config.headers.Authorization
        ? "Bearer token added"
        : "Not added"
    );

    console.log(
      "Content-Type:",
      config.headers["Content-Type"] ||
      config.headers["content-type"] ||
      "Browser will set automatically"
    );


    return config;
  },

  (error) => {

    console.error(
      "❌ Request Error:",
      error
    );

    return Promise.reject(error);
  }
);


// ==========================================
// RESPONSE INTERCEPTOR
// ==========================================

AxiosInterceptor.interceptors.response.use(

  // ========================================
  // SUCCESS
  // ========================================

  (response) => {

    console.log("✅ Axios Response");

    console.log(
      "Status:",
      response.status
    );

    console.log(
      "URL:",
      response.config.url
    );

    console.log(
      "Data:",
      response.data
    );

    return response;
  },


  // ========================================
  // ERROR
  // ========================================

  (error) => {

    // ======================================
    // SERVER RESPONDED
    // ======================================

    if (error.response) {

      const status =
        error.response.status;

      const url =
        error.config?.url;

      console.error("❌ API Error");

      console.error(
        "Status:",
        status
      );

      console.error(
        "URL:",
        url
      );

      // Keep technical error only
      // inside browser console
      console.error(
        "Backend Data:",
        error.response.data
      );


      // ====================================
      // REQUEST PATH
      // ====================================

      const requestPath =
        url?.split("?")[0];

      const isPublicEndpoint =
        publicEndpoints.includes(
          requestPath
        );


      // ====================================
      // 401 UNAUTHORIZED
      // ====================================

      if (status === 401) {

        console.log(
          "Unauthorized: Token expired or invalid"
        );


        if (!isPublicEndpoint) {

          // Remove authentication data

          localStorage.removeItem("token");

          localStorage.removeItem(
            "hospitalId"
          );

          localStorage.removeItem(
            "hospitalName"
          );

          localStorage.removeItem(
            "adminName"
          );


          // =================================
          // REPLACE TECHNICAL ERROR
          // =================================

          error.response.data = {
            status: 401,
            message:
              "Your session has expired. Please login again."
          };


          // Redirect to login

          window.location.href =
            "/login";
        }
      }


      // ====================================
      // 403 FORBIDDEN
      // ====================================

      else if (status === 403) {

        console.log(
          "Forbidden: You don't have permission"
        );


        error.response.data = {
          status: 403,
          message:
            "You are not authorized to perform this action."
        };
      }


      // ====================================
      // 404 NOT FOUND
      // ====================================

      else if (status === 404) {

        console.log(
          "API endpoint not found"
        );


        error.response.data = {
          status: 404,
          message:
            "The requested resource was not found."
        };
      }


      // ====================================
      // 409 CONFLICT
      // ====================================

      else if (status === 409) {

        console.log(
          "Conflict:",
          error.response.data
        );

        // Keep backend's business message.
        //
        // Example:
        // "Patient ID is already registered
        //  in this hospital"
      }


      // ====================================
      // 400 BAD REQUEST
      // ====================================

      else if (status === 400) {

        console.log(
          "Bad request:",
          error.response.data
        );

        // Keep backend validation/business
        // message.
      }


      // ====================================
      // 500+ SERVER ERROR
      // ====================================

      else if (status >= 500) {

        console.error(
          "Internal server error:",
          error.response.data
        );


        // =================================
        // DO NOT SHOW TECHNICAL ERROR
        // =================================

        error.response.data = {
          status: status,
          message:
            "Something went wrong. Please try again later."
        };
      }
    }


    // ======================================
    // NO RESPONSE FROM SERVER
    // ======================================

    else if (error.request) {

      console.error(
        "❌ Server is not responding"
      );

      console.error(
        "Request:",
        error.config?.baseURL +
        error.config?.url
      );

      console.error(
        "Possible CORS/network problem"
      );


      // User-friendly message

      error.userMessage =
        "Unable to connect to the server. Please check your internet connection and try again.";
    }


    // ======================================
    // AXIOS ERROR
    // ======================================

    else {

      console.error(
        "❌ Axios Error:",
        error.message
      );


      error.userMessage =
        "Something went wrong. Please try again.";
    }


    return Promise.reject(error);
  }
);


export default AxiosInterceptor;