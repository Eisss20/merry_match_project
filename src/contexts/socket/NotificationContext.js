import { createContext, useContext, useEffect, useState } from "react";
import { useSocketConnection } from "./SocketConnectionContext";
import { useAuth } from "../AuthContext";

import axios from "axios";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { socket, userId } = useSocketConnection();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const [matchesList, setMatchesList] = useState([]);
  const [lastChats, setLastChats] = useState([]);

  const { state } = useAuth();

  // Fetch notification on the first time on page
  useEffect(() => {
    if (!userId) return;

    const fetchChatsData = async () => {
      try {
        const fetchUrls = {
          matches: `/api/matches/chats/?userMasterId=${userId}&filter=matches`,
          lastChats: `/api/matches/chats/?userMasterId=${userId}&filter=lastChats`,
        };

        const responses = await Promise.all(
          Object.values(fetchUrls).map((url) => axios.get(url)),
        );

        const [matchesResponse, lastChatsResponse] = responses;

        setMatchesList(matchesResponse.data);
        setLastChats(lastChatsResponse.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchChatsData();
  }, [userId]);

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

    // Listen for update events and refetch notifications
    socket.on("updateMatches", async () => {
      console.log("Matches notification updated");

      const response = await axios.get(
        `/api/matches/chats/?userMasterId=${state.user?.id}&filter=matches`,
      );

      setMatchesList(response.data);
    });

    socket.on("updateChats", async () => {
      console.log("Chats notification updated");

      const response = await axios.get(
        `/api/matches/chats/?userMasterId=${state.user?.id}&filter=lastChats`,
      );

      setLastChats(response.data);
    });

    return () => {
      socket.off("newNotifications");
      socket.off("updateMatches");
      socket.off("updateChats");
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
        matchesList,
        lastChats,
        markNotifAsReadOnServer,
        markNotifAsReadOnClient,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
