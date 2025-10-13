
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
  force_logout: number;
  logged_in_status: number;
  last_logged_in: string;
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

// export interface ApiNotification {
//   id: number;
//   from_user_id: number;
//   from_username: string;
//   to_user_id: number;
//   to_username: string;
//   title: string;
//   message: string;
//   type: string;
//   created_at: string;
// };

interface ApiResponse {
  success: boolean;
  data: ApiMessage[];
  pagination: {
    page: number;
    limit: number;
  };
}

// interface FetchNotificationsResponse {
//   success: boolean;
//   message: string;
//   data: {
//     notifications: ApiNotification[];
//     pagination: {
//       currentPage: number;
//       totalPages: number;
//       totalNotifications: number;
//       limit: number;
//     };
//   };
// }

// interface SendNotificationResponse {
//   success: boolean;
//   message: string;
//   data: {
//     notification: ApiNotification;
//     fcm_response: string;
//   };
// }

// interface NotificationPayload {
//   from_user_id: number;
//   to_user_id: number;
//   title: string;
//   message: string;
//   type: string;
// }

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
}

// interface FetchNotificationsResponse {
//   success: boolean;
//   message: string;
//   data: {
//     notifications: ApiNotification[];
//     pagination: {
//       currentPage: number;
//       totalPages: number;
//       totalNotifications: number;
//       limit: number;
//     };
//   };
// }

interface SendNotificationResponse {
  success: boolean;
  message: string;
  data: {
    notification: ApiNotification;
    fcm_response: string;
  };
}

// Updated payload to match Postman (no from_user_id)
interface NotificationPayload {
  to_user_id: number;
  title: string;
  message: string;
  type: string;
}

// Separate interface for user list (as requested)
export interface UserListItem {
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
  force_logout: number;
  logged_in_status: number;
  last_logged_in: string;
}

// Type definitions
export type Group = {
  group_id: number;
  group_name: string;
  creator_name: string;
  member_count: number;
  created_at: string | null;
  group_dp: string | null;
  creator_id: number | null;
  creator_dp: string | null;
};

export type Member = {
  user_id: number;
  member_name: string;
  phone_number: string;
  email: string | null;
  role_name: string;
  added_on: string;
  is_active: number;
};

// Add this type near your other interfaces
export interface ForceLogoutResponse {
  status: boolean;
  message?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE || "https://apps.ekarigar.com/backend";
const BASE_URL = `${API_BASE_URL}/admin`;

const getAuthHeaders = (): Record<string, string> => {
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

// Updated fetchNotifications to match Postman endpoint (/backend/admin/notifications)
// Supports optional to_user_id for filtering (appended as query param; assumes backend handles it)
// Updated fetchNotifications to remove success check and handle varying response structures
// Updated fetchNotifications return type to include pagination always (even if undefined)
// ./src/app/services/apiService.tsx

// Remove unused FetchNotificationsResponse interface

// Update fetchNotifications to avoid 'any':
export const fetchNotifications = async (
  toUserId?: number,
  page: number = 1,
  limit: number = 10
): Promise<{ 
  notifications: ApiNotification[]; 
  pagination?: { 
    currentPage: number; 
    totalPages: number; 
    totalNotifications: number; 
    limit: number; 
  } 
}> => {
  try {
    let url = `${BASE_URL}/notifications?page=${page}&limit=${limit}`;
    if (toUserId !== undefined && toUserId !== 0) {
      url += `&to_user_id=${toUserId}`;
    }
    const response = await axios.get(url, {
      headers: getAuthHeaders(),
    });
    // Handle direct array or wrapped data
    const data = response.data.data || response.data;
    const notifications = Array.isArray(data) ? data : (data.notifications || []);
    // Define a type for data to avoid any
    type ApiData = {
      notifications?: ApiNotification[];
      pagination?: {
        currentPage: number;
        totalPages: number;
        totalNotifications: number;
        limit: number;
      };
    };
    const typedData = data as ApiData;
    return {
      notifications: notifications as ApiNotification[],
      pagination: typedData.pagination,
    };
  } catch (error) {
    console.error("API Error:", error);
    throw new Error("Failed to fetch notifications. Please try again.");
  }
};

// Updated sendNotification to match Postman endpoint and payload (no from_user_id)
// Updated sendNotification to handle the new response structure
export const sendNotification = async (payload: NotificationPayload): Promise<SendNotificationResponse> => {
  try {
    const response = await axios.post<SendNotificationResponse>(
      `${BASE_URL}/send_notifications`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
      }
    );
    // Assume success if no error thrown by axios; check message if needed
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw new Error("Failed to send notification. Please try again.");
  }
};

// Fetch all groups
export const fetchGroups = async (): Promise<Group[]> => {
  try {
    const headers = new Headers({
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    });

    const response = await fetch(`${BASE_URL}/groups`, {
      method: 'GET',
      headers: headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: Group[] = await response.json(); // Explicitly type as Group[]
    return data.map((group: Group) => ({
      group_id: group.group_id,
      group_name: group.group_name,
      creator_name: group.creator_name,
      member_count: group.member_count,
      created_at: group.created_at ?? null,
      group_dp: group.group_dp ?? null,
      creator_id: group.creator_id ?? null,
      creator_dp: group.creator_dp ?? null,
    }));
  } catch (error) {
    console.error('Error fetching groups:', error);
    throw error;
  }
};

// Fetch members of a specific group
export const fetchGroupMembers = async (groupId: number): Promise<Member[]> => {
  try {
    const headers = new Headers({
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    });

    const response = await fetch(`${BASE_URL}/groups/${groupId}/members`, {
      method: 'GET',
      headers: headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: Member[] = await response.json(); // Explicitly type as Member[]
    return data.map((member: Member) => ({
      user_id: member.user_id,
      member_name: member.member_name,
      phone_number: member.phone_number,
      email: member.email,
      role_name: member.role_name,
      added_on: member.added_on,
      is_active: member.is_active,
    }));
  } catch (error) {
    console.error(`Error fetching members for group ${groupId}:`, error);
    throw error;
  }
};

export async function forceLogoutUser(userId: number): Promise<ForceLogoutResponse> {
  try {
    const res = await axios.post<ForceLogoutResponse>(`${API_BASE_URL}/api/users/force-logout`, {
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
