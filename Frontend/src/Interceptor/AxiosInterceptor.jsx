import axios from "axios";

// ==========================================
// AXIOS INSTANCE
// ==========================================

console.log("API URL:", import.meta.env.VITE_API_URL);

const AxiosInterceptor = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000,
});

// ==========================================
// PUBLIC ENDPOINTS
// ==========================================

const publicEndpoints = [
  "/user/login",
  "/user/register",
  "/user/test",
];

// ==========================================
// CHECK WHETHER ENDPOINT IS PUBLIC
// ==========================================

const isPublicRequest = (url = "") => {
  const requestPath = url
    .split("?")[0]
    .replace(/\/+$/, "");

  return publicEndpoints.some(
    (endpoint) =>
      requestPath === endpoint ||
      requestPath.endsWith(endpoint)
  );
};

// ==========================================
// REQUEST INTERCEPTOR
// ==========================================

AxiosInterceptor.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    const isPublicEndpoint = isPublicRequest(config.url);

    // ==========================================
    // ADD JWT TOKEN TO PROTECTED ENDPOINTS
    // ==========================================

    if (token && !isPublicEndpoint) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }

    // ==========================================
    // CONTENT TYPE
    // ==========================================

    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
      delete config.headers["content-type"];
    } else {
      config.headers["Content-Type"] = "application/json";
    }

    // ==========================================
    // DEBUG INFORMATION
    // ==========================================

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

    return config;
  },

  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

// ==========================================
// RESPONSE INTERCEPTOR
// ==========================================

AxiosInterceptor.interceptors.response.use(
  (response) => {
    console.log("✅ Axios Response");
    console.log("Status:", response.status);
    console.log("URL:", response.config.url);
    console.log("Data:", response.data);

    return response;
  },

  (error) => {
    if (error.response) {
      const status = error.response.status;
      const url = error.config?.url;

      const isPublicEndpoint =
        isPublicRequest(url);

      console.error("❌ API Error");
      console.error("Status:", status);
      console.error("URL:", url);
      console.error(
        "Backend Data:",
        error.response.data
      );

      // ==========================================
      // 401 UNAUTHORIZED
      // ==========================================

      if (status === 401) {
        // Don't remove token or redirect for
        // public endpoints such as register/login
        if (!isPublicEndpoint) {
          localStorage.removeItem("token");
          localStorage.removeItem("hospitalId");
          localStorage.removeItem("hospitalName");
          localStorage.removeItem("adminName");

          error.response.data = {
            status: 401,
            message:
              "Your session has expired. Please login again.",
          };

          // Prevent repeated redirects
          if (
            window.location.pathname !== "/login"
          ) {
            window.location.href = "/login";
          }
        }
      }

      // ==========================================
      // 403 FORBIDDEN
      // ==========================================

      else if (status === 403) {
        error.response.data = {
          status: 403,
          message:
            "You are not authorized to perform this action.",
        };
      }

      // ==========================================
      // 404 NOT FOUND
      // ==========================================

      else if (status === 404) {
        error.response.data = {
          status: 404,
          message:
            "The requested resource was not found.",
        };
      }

      // ==========================================
      // 409 CONFLICT
      // ==========================================

      else if (status === 409) {
        console.log(
          "Conflict:",
          error.response.data
        );
      }

      // ==========================================
      // 400 BAD REQUEST
      // ==========================================

      else if (status === 400) {
        console.log(
          "Bad request:",
          error.response.data
        );
      }

      // ==========================================
      // 500+ SERVER ERROR
      // ==========================================

      else if (status >= 500) {
        console.error(
          "Internal server error:",
          error.response.data
        );

        error.response.data = {
          status: status,
          message:
            "Something went wrong. Please try again later.",
        };
      }
    }

    // ==========================================
    // NO RESPONSE FROM SERVER
    // ==========================================

    else if (error.request) {
      console.error(
        "❌ Server is not responding"
      );

      console.error(
        "Request:",
        `${error.config?.baseURL}${error.config?.url}`
      );

      error.userMessage =
        "Unable to connect to the server. Please check your connection and try again.";
    }

    // ==========================================
    // OTHER AXIOS ERROR
    // ==========================================

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