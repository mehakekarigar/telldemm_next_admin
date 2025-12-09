// src/app/services/authService.tsx
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";

interface LoginPayload {
  email: string;
  password: string;
}

interface ErrorResponse {
  message?: string;
}

// const API_BASE_URL = "https://telldemm-backend.onrender.com";
const API_BASE_URL = "https://apps.ekarigar.com/backend";
// const API_BASE_URL = "http://localhost:5000";



export const login = async (payload: LoginPayload): Promise<string> => {
  try {
    const response = await axios.post<{ token: string }>(
      `${API_BASE_URL}/admin/login`,
      payload
    );
    return response.data.token;
  } catch (error: unknown) {
    // Type check for AxiosError
    if (error instanceof AxiosError) {
      const message =
        (error.response?.data as ErrorResponse | undefined)?.message ||
        "Login failed. Please try again.";
      throw new Error(message);
    }
    // Fallback for non-Axios errors
    throw new Error("An unexpected error occurred.");
  }
};