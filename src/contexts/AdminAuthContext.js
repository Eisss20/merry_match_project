import React, { createContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const AdminAuthContext = createContext();

function AdminAuthProvider({ children }) {
  const [state, setState] = useState({
    loading: false,
    success: null,
    admin: null,
    error: null,
    isAuthenticated: false,
    token: null,
  });

  const router = useRouter();

  useEffect(() => {
    // ตรวจสอบ token ใน LocalStorage
    const adminToken = localStorage.getItem("adminToken");

    if (adminToken) {
      try {
        const userData = jwtDecode(adminToken);
        const now = Date.now() / 1000; // เวลาในหน่วยวินาที

        if (userData.exp > now) {
          // หากโทเค็นยังไม่หมดอายุ
          setState({
            loading: false,
            isAuthenticated: true,
            admin: userData,
            token: adminToken,
            error: null,
          });
        } else {
          // หากโทเค็นหมดอายุ
          localStorage.removeItem("adminToken");
          setState({
            loading: false,
            isAuthenticated: false,
            admin: null,
            token: null,
            error: null,
          });
        }
      } catch (error) {
        console.error("Token decoding error:", error);
        localStorage.removeItem("adminToken");
        setState({
          loading: false,
          isAuthenticated: false,
          admin: null,
          token: null,
          error: null,
        });
      }
    } else {
      setState((prevState) => ({
        ...prevState,
        loading: false,
        isAuthenticated: false,
      }));
    }
  }, []);

  //const [isAuthenticated, setIsAuthenticated] = useState(false);
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const login = async (data) => {
    setState((prevState) => ({ ...prevState, loading: true }));
    try {
      const result = await axios.post(
        `${apiBaseUrl}/api/auth/admin/login`,
        data,
      );
      const adminToken = result.data.adminToken; // รับ Token back จาก api/auth/admin/login
      localStorage.setItem("adminToken", adminToken); // บันทึกโทเค็นใน Local Storage

      const userDataFromToken = jwtDecode(adminToken);

      setState({
        loading: false,
        success: result.data.message,
        admin: userDataFromToken,
        isAuthenticated: true,
        token: adminToken,
        error: null,
      });
      router.push("/admin/merry-package-list");
    } catch (error) {
      const apiError = error.response?.data?.message;
      setState((prevState) => ({
        ...prevState,
        loading: false,
        error: typeof apiError === "object" ? apiError : { general: apiError },
      }));
    }
  };

  // เพิ่มฟังก์ชัน logout
  const logout = () => {
    localStorage.removeItem("adminToken"); // ลบ token ออกจาก LocalStorage
    setState({
      loading: false,
      success: null,
      admin: null,
      isAuthenticated: false,
      token: null,
      error: null,
    });
    router.push("/admin/login"); // Redirect ไปหน้า Login
  };

  return (
    <AdminAuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

const useAdminAuth = () => React.useContext(AdminAuthContext);

export { AdminAuthProvider, useAdminAuth };
