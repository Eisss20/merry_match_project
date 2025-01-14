import "@/styles/globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

// Socket
import { SocketConnectionProvider } from "@/contexts/socket/SocketConnectionContext";
import { NotificationProvider } from "@/contexts/socket/NotificationContext";
import { ChatProvider } from "@/contexts/socket/ChatContext";

export default function App({ Component, pageProps }) {
  const router = useRouter();

  const [isRouterReady, setIsRouterReady] = useState(false);

  useEffect(() => {
    setIsRouterReady(true);
  }, []);

  // เพิ่มการตรวจสอบ isRouterReady
  if (!isRouterReady) {
    return null; // หรือ loading component
  }

  // ตรวจสอบเส้นทางปัจจุบัน
  if (router.pathname.startsWith("/admin")) {
    // สำหรับเส้นทาง admin ใช้ AdminAuthProvider
    return (
      <AdminAuthProvider>
        <Component {...pageProps} />
      </AdminAuthProvider>
    );
  }

  // สำหรับหน้า User
  return (
    <AuthProvider>
      <SocketConnectionProvider>
        <NotificationProvider>
          <ChatProvider>
            <Component {...pageProps} />
          </ChatProvider>
        </NotificationProvider>
      </SocketConnectionProvider>
    </AuthProvider>
  );
}
