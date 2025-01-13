import { createContext, useContext, useEffect, useState } from "react";
import { useSocketConnection } from "./SocketConnectionContext";
import { useAuth } from "../AuthContext";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { socket, userId } = useSocketConnection();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!socket || !userId) return;

    // Fetch notifications manually
    socket.emit("fetchNotifications", userId);

    // Listen for new notifications
    socket.on("newNotifications", (data) => {
      console.log("New notifications received:", data);
      setNotifications(data);
      const unread = data.filter(
        (notification) => !notification.is_read,
      ).length;

      setUnreadCount(unread);
    });

    return () => {
      socket.off("newNotifications");
    };
  }, [socket, userId]);

  // Mark notifications as read on the server
  const markNotifAsReadOnServer = () => {
    if (userId && socket) {
      socket.emit("markNotificationsAsRead", userId);
      setUnreadCount(0);
    }
  };

  // Mark notifications as read on the client
  const markNotifAsReadOnClient = () => {
    const hasUnread = notifications.some(
      (notification) => !notification.is_read,
    );

    if (hasUnread) {
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) => ({
          ...notification,
          is_read: true,
        })),
      );
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markNotifAsReadOnServer,
        markNotifAsReadOnClient,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
