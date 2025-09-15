// services/userService.ts
import axios from "axios";
import Cookies from "js-cookie"; // Make sure this is installed: npm i js-cookie

export type ApiUser = {
  user_id: number;
  name: string;
  phone_number: string;
  email: string | null;
  profile_picture_url: string | null;
  status: string;
  created_at: string;
  public_key: string | null;
  key_created_at: string | null;
  last_seen: string;
  is_online: boolean;
}



interface ApiMessage {
  message_id: number;
  sender: string;
  recipient: string;
  message: string;
  timestamp: string;
  status: string; // e.g., "sent"
  actions: string[]; // e.g., ["view", "delete"]
}

interface ApiResponse {
  success: boolean;
  data: ApiMessage[];
  pagination: {
    page: number;
    limit: number;
  };
}

// const API_BASE_URL = "https://telldemm-backend.onrender.com";
const API_BASE_URL = "https://apps.ekarigar.com/backend";
// const API_BASE_URL = "http://localhost:5000";



const getAuthHeaders = () => {
  const token = Cookies.get("auth_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchUsers = async (): Promise<ApiUser[]> => {
  try {
    const response = await axios.get<ApiUser[]>(`${API_BASE_URL}/admin/users`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw new Error("Failed to fetch users. Please try again.");
  }
};


export const fetchMessages = async (): Promise<ApiMessage[]> => {
  try {
    const response = await axios.get<ApiResponse>(`${API_BASE_URL}/admin/messages`, {
      headers: getAuthHeaders(),
    });
    if (!response.data.success) {
      throw new Error("API request failed.");
    }
    return response.data.data;
  } catch (error) {
    console.error("API Error:", error);
    throw new Error("Failed to fetch messages. Please try again.");
  }
};
