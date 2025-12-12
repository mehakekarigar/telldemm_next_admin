
import axios from "axios";
import Cookies from "js-cookie"; 
import { ReactNode } from "react";

// Create axios instance
const apiClient = axios.create();

// Response interceptor to handle 401 errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear the auth token
      Cookies.remove("auth_token");
      // Redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/Login';
      }
    }
    return Promise.reject(error);
  }
);

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

interface FetchGroupsResponse {
  data: Group[];
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

export type Channel = {
  creator_name: ReactNode;
  channel_id: number;
  channel_name: string;
  description: string;
  created_by: string;
  created_at: string | null;
  firebase_channel_id: string;
  channel_dp: string | null;
  is_public: number;
  max_members: number;
  total_members :number;
  delete_status: number;
  deleted_at: string | null;
};

// --- Channel & ChannelMember types (updated to match API response) ---
export type ChannelInfo = {
  channel_id: number;
  channel_name: string;
  channel_dp: string | null;
};

export type ChannelMember = {
  member_id: number;
  user_id: number;
  role_id: number;
  joined_at: string;
  is_active: number;
  email: string | null;
  name: string;
  removed_at: string | null;
  role_name: string;
};

// Optional combined response type for convenience
export type ChannelMembersResponse = {
  channelInfo?: ChannelInfo;
  members: ChannelMember[];
  pagination?: {
    page: number;
    limit: number;
    totalPages?: number;
    totalCount?: number;
  };
};



// export type 

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
    const response = await apiClient.get<ApiUser[]>(`${API_BASE_URL}/admin/users`, {
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
    const response = await apiClient.get<ApiResponse>(`${API_BASE_URL}/admin/messages`, {
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
    const response = await apiClient.get(url, {
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
    const response = await apiClient.post<SendNotificationResponse>(
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
  const response = await apiClient.get<FetchGroupsResponse>(`${BASE_URL}/groups`, {
    headers: getAuthHeaders(),
  });

  const data: Group[] = response.data.data || response.data; // Explicitly type as Group[]
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
    const res = await apiClient.post<ForceLogoutResponse>(`${API_BASE_URL}/api/users/force-logout`, {
      user_id: userId,
    });
    return res.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      throw new Error(err.response?.data?.message || "Failed to force logout user");
    }
    throw new Error("API call failed");
  }
};

// Fetch channels with pagination
export const fetchChannels = async (page: number = 1, limit: number = 10): Promise<{ channels: Channel[]; pagination: { page: number; limit: number; totalPages: number; totalCount: number } }> => {
  try {
    const response = await apiClient.get(`${BASE_URL}/channels?page=${page}&limit=${limit}`, {
      headers: getAuthHeaders(),
    });

    const data = response.data;
    return {
      channels: data.channels,
      pagination: data.pagination,
    };
  } catch (error) {
    console.error('Error fetching channels:', error);
    throw error;
  }
};

// Fetch channel detail
export const fetchChannelDetail = async (channelId: number): Promise<Channel> => {
  try {
    const response = await apiClient.get(`${BASE_URL}/channels/${channelId}`, {
      headers: getAuthHeaders(),
    });

    return response.data.channel;
  } catch (error) {
    console.error('Error fetching channel detail:', error);
    throw error;
  }
};

// Fetch channel members with pagination
// --- fetchChannelMembers: parse API response { channelInfo, members, pagination } ---
export const fetchChannelMembers = async (
  channelId: number,
  page: number = 1,
  limit: number = 15
): Promise<ChannelMembersResponse> => {
  try {
    const response = await apiClient.get(`${BASE_URL}/channels/${channelId}/members?page=${page}&limit=${limit}`, {
      headers: getAuthHeaders(),
    });

    const data = response.data;

    let channelInfo: ChannelInfo | undefined = undefined;
    let members: ChannelMember[] = [];
    let pagination: ChannelMembersResponse['pagination'] | undefined = undefined;

    if (data) {
      if (data.channelInfo) {
        channelInfo = data.channelInfo as ChannelInfo;
      }

      // members might be at data.members or data.data.members etc. Try common locations:
      if (Array.isArray(data.members)) {
        members = data.members as ChannelMember[];
      } else if (Array.isArray(data.data?.members)) {
        members = data.data.members as ChannelMember[];
      } else if (Array.isArray(data.data)) {
        // sometimes API returns wrapped data array directly
        members = data.data as ChannelMember[];
      } else if (Array.isArray(data)) {
        members = data as ChannelMember[];
      }

      // pagination
      if (data.pagination) {
        pagination = {
          page: data.pagination.page ?? page,
          limit: data.pagination.limit ?? limit,
          totalPages: data.pagination.totalPages ?? data.pagination.totalPages,
          totalCount: data.pagination.totalCount ?? data.pagination.totalCount,
        };
      } else if (data.data?.pagination) {
        pagination = {
          page: data.data.pagination.page ?? page,
          limit: data.data.pagination.limit ?? limit,
          totalPages: data.data.pagination.totalPages,
          totalCount: data.data.pagination.totalCount,
        };
      }
    }

    return {
      channelInfo,
      members,
      pagination,
    };
  } catch (error) {
    console.error(`Error fetching members for channel ${channelId}:`, error);
    throw error;
  }
};


