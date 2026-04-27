"use server";

import axios from "axios";
import Cookies from "js-cookie";
import { BACKEND_URL } from "@/constants/url";
import logger from "@/lib/logger/logger";
import { cookies } from "next/headers";

const AUTH_COOKIE = "ldjsldjs82ydkz";

interface Notification {
  id: number;
  title: string;
  status: "read" | "unread";
  created_at: string;
}

interface NotificationDetail {
  id: number;
  customer_id: number;
  title: string;
  message: string;
  status: "read" | "unread";
  created_at: string;
  updated_at: string;
}

interface UnreadNotificationsResponse {
  success: boolean;
  notifications: Notification[];
}

interface NotificationDetailResponse {
  success: boolean;
  notification: NotificationDetail;
}

// Get unread notifications
export async function getUnreadNotifications(): Promise<UnreadNotificationsResponse | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) return null;

    const response = await axios.get<UnreadNotificationsResponse>(
      `${BACKEND_URL}/customer/notifications/unread`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    logger.info("Notifications:", response);
    return response.data;
  } catch (error) {
    logger.error("Failed to fetch unread notifications:", error);
    return null;
  }
}

// Get notification detail by ID
export async function getNotificationDetail(
  id: number
): Promise<NotificationDetailResponse | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE)?.value;
    if (!token) return null;

    const response = await axios.get<NotificationDetailResponse>(
      `${BACKEND_URL}/customer/notifications/${id}`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    logger.error("Failed to fetch notification detail:", error);
    return null;
  }
}
