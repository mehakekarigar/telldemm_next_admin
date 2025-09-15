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
  force_logout:number;
  logged_in_status:number;
  last_logged_in:string;
};

export interface ApiMessage {
  message_id: number;
  sender: string;
  recipient: string;
  message: string;
  timestamp: string;
  status: string; // e.g., "sent"
  actions: string[]; // e.g., ["view", "delete"]
};

export interface ApiNotification {
  id: number;
  from_user_id: number;
  from_username: string;
  to_user_id: number;
  to_username: string;
  title: string;
  message: string;
  type: string;
  created_at: string;
};

interface ApiResponse {
  success: boolean;
  data: ApiMessage[];
  pagination: {
    page: number;
    limit: number;
  };
}

interface FetchNotificationsResponse {
  success: boolean;
  message: string;
  data: {
    notifications: ApiNotification[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalNotifications: number;
      limit: number;
    };
  };
}

interface SendNotificationResponse {
  success: boolean;
  message: string;
  data: {
    notification: ApiNotification;
    fcm_response: string;
  };
}

interface NotificationPayload {
  from_user_id: number;
  to_user_id: number;
  title: string;
  message: string;
  type: string;
}

// Add this type near your other interfaces
export interface ForceLogoutResponse {
  status: boolean;
  message?: string;
}

// const API_BASE_URL = "https://telldemm-backend.onrender.com";
const API_BASE_URL = "https://apps.ekarigar.com/backend";
// const API_BASE_URL = "http://localhost:5000";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://apps.ekarigar.com/backend";



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

export const fetchNotifications = async (
  user_id: number,
  page: number,
  limit: number
): Promise<{ notifications: ApiNotification[] }> => {
  try {
    const response = await axios.get<FetchNotificationsResponse>(
      `${API_BASE_URL}/api/notification/notifications?user_id=${user_id}&page=${page}&limit=${limit}`,
      {
        headers: getAuthHeaders(),
      }
    );
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch notifications");
    }
    return response.data.data;
  } catch (error) {
    console.error("API Error:", error);
    throw new Error("Failed to fetch notifications. Please try again.");
  }
};

export const sendNotification = async (payload: NotificationPayload): Promise<ApiNotification> => {
  try {
    const response = await axios.post<SendNotificationResponse>(
      `${API_BASE_URL}/api/notification/send_notification`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
      }
    );
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to send notification");
    }
    return response.data.data.notification;
  } catch (error) {
    console.error("API Error:", error);
    throw new Error("Failed to send notification. Please try again.");
  }
};

// export const forceLogoutUser = async (
//   user_id: number
// ): Promise<{ status: boolean; message: string }> => {
//   try {
//     const response = await axios.post(
//       `${API_BASE_URL}/api/users/force-logout`,
//       { user_id },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           ...getAuthHeaders(),
//         },
//       }
//     );

//     return response.data; // { status: true, message: "User has been forcefully logged out" }
//   } catch (error: any) {
//     console.error("API Error (Force Logout):", error);
//     throw new Error(
//       error.response?.data?.message || "Failed to force logout user"
//     );
//   }
// };

export async function forceLogoutUser(userId: number): Promise<ForceLogoutResponse> {
  try {
    const res = await axios.post<ForceLogoutResponse>(`${API_BASE}/api/users/force-logout`, {
      user_id: userId,
    });
    return res.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      throw new Error(err.response?.data?.message || "Failed to force logout user");
    }
    throw new Error("API call failed");
  }
}
