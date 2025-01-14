import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../AuthContext";

const SocketConnectionContext = createContext();

export const SocketConnectionProvider = ({ children }) => {
  const { state, isAuthenticated } = useAuth();

  const [socket, setSocket] = useState(null);
  const [userId, setUserId] = useState(null);

  // Initialize socket connection
  useEffect(() => {
    const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_SERVER_URL, {
      path: "/socket.io",
    });
    setSocket(socketInstance);

    // Register user if authenticated
    if (state.user?.id && isAuthenticated) {
      socketInstance.emit("registerUser", state.user.id);
      setUserId(state.user.id);
    }

    return () => {
      socketInstance.disconnect();
    };
  }, [state.user?.id, isAuthenticated]);

  return (
    <SocketConnectionContext.Provider value={{ socket, userId }}>
      {children}
    </SocketConnectionContext.Provider>
  );
};

export const useSocketConnection = () => useContext(SocketConnectionContext);
