import { createContext, useContext, useEffect, useState } from "react";
import { useSocketConnection } from "./SocketConnectionContext";
import { useAuth } from "../AuthContext";
import apiClient from "@/utils/jwtInterceptor";
import { useRouter } from "next/router";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { socket, userId } = useSocketConnection();
  const { state, isAuthenticated } = useAuth();
  const router = useRouter();

  const [messages, setMessages] = useState([]);
  const [otherUserData, setOtherUserData] = useState(null);
  const [chatRoomId, setChatRoomId] = useState(null);
  const [imageFiles, setImageFiles] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);

  // Automatically set chatRoomId from the dynamic route
  useEffect(() => {
    if (router.query.id) {
      setChatRoomId(router.query.id);
    } else {
      setChatRoomId(null); // Reset chatRoomId when not on a chat page
    }
  }, [router.query.id]);

  // Handle route change to leave the room
  useEffect(() => {
    const handleRouteChange = () => {
      if (socket && chatRoomId) {
        console.log(`User: ${userId} leaving room: ${chatRoomId}`);
        socket.emit("leaveRoom", chatRoomId);
      }
    };

    router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [socket, chatRoomId, userId]);

  // Join chat room and listen for messages
  useEffect(() => {
    if (!isAuthenticated || !socket || !chatRoomId) return;

    console.log(`User: ${userId} joining room: ${chatRoomId}`);
    socket.emit("joinRoom", chatRoomId);

    socket.on("receiveMessage", (msg) => {
      console.log("New message received:", msg);
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [socket, chatRoomId, isAuthenticated, userId]);

  // Fetch chat history and other user data
  useEffect(() => {
    const fetchChatData = async () => {
      try {
        if (!chatRoomId || state.loading || !isAuthenticated) return;

        const response = await apiClient.get(
          `/api/chat/chatHistory?chatRoomId=${chatRoomId}&userId=${userId}`,
        );

        if (response.data?.messages) {
          setMessages(response.data.messages);
          setOtherUserData(response.data.otherUserData);
        }
      } catch (error) {
        console.error("Failed to fetch chat data:", error);
      }
    };

    fetchChatData();
  }, [chatRoomId, state.loading, isAuthenticated, userId]);

  return (
    <ChatContext.Provider
      value={{
        messages,
        otherUserData,
        chatRoomId,
        imageFiles,
        setImageFiles,
        selectedImage,
        setSelectedImage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
