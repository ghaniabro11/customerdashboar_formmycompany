"use client";

import React, { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getUnreadNotifications, getNotificationDetail } from "@/apis/notifications";
import { formatDistanceToNow } from "date-fns";
import logger from "@/lib/logger/logger";

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

const Notifications = () => {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedNotification, setSelectedNotification] =
    useState<NotificationDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch unread notifications
  const fetchNotifications = async () => {
    if (status !== "authenticated") return;

    setLoading(true);
    try {
      const response = await getUnreadNotifications();
      logger.info("Notifications:", response);
      if (response?.success && response.notifications) {
        setNotifications(response.notifications);
        setUnreadCount(response.notifications.length);
      } else {
        setNotifications([]);
        setUnreadCount(0);
      }
    } catch (error) {
      logger.error("Error fetching notifications:", error);
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  };

  // Fetch notification detail
  const handleViewNotification = async (notificationId: number) => {
    setDetailLoading(true);
    try {
      const response = await getNotificationDetail(notificationId);
      if (response?.success && response.notification) {
        setSelectedNotification(response.notification);
        // Refresh notifications after viewing (to remove from unread list)
        await fetchNotifications();
      }
    } catch (error) {
      logger.error("Error fetching notification detail:", error);
    } finally {
      setDetailLoading(false);
    }
  };

  // Initial fetch and periodic refresh
  useEffect(() => {
    if (status === "authenticated") {
      fetchNotifications();
      // Refresh every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [status]);

  // Refresh when dialog opens
  useEffect(() => {
    if (isOpen && status === "authenticated") {
      fetchNotifications();
    }
  }, [isOpen, status]);

  if (status !== "authenticated") {
    return null;
  }

  return (
    <>
      {/* Notification Icon */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative  hover:bg-gray-100 rounded-full transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-6 h-6 text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-orange text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="md:max-w-2xl max-w-[95dvw] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Notifications</DialogTitle>
          </DialogHeader>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-500">Loading notifications...</div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <Bell className="w-12 h-12 mb-4 opacity-50" />
              <p className="text-lg font-medium">No new notifications</p>
              <p className="text-sm mt-2">You're all caught up!</p>
            </div>
          ) : (
            <div className="space-y-3 mt-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border ${
                    notification.status === "unread"
                      ? "bg-orange/5 border-orange/20"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {notification.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {formatDistanceToNow(new Date(notification.created_at), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewNotification(notification.id)}
                      disabled={detailLoading}
                      className="ml-4"
                    >
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Notification Detail View */}
          {selectedNotification && (
            <div className="mt-6 pt-6 border-t">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {selectedNotification.title}
                  </h3>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {selectedNotification.message}
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  <p>
                    {formatDistanceToNow(
                      new Date(selectedNotification.created_at),
                      { addSuffix: true }
                    )}
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setSelectedNotification(null)}
                  className="w-full"
                >
                  Back to Notifications
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Notifications;
