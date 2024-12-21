import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const AuthContext = React.createContext();

function AuthProvider({ children }) {
  const [state, setState] = useState({
    loading: true,
    success: null,
    error: null,
    user: null,
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const router = useRouter();

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Check expired token on refresh
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const userDataFromToken = jwtDecode(token);
        const isExpired = userDataFromToken.exp * 1000 < Date.now();

        if (!isExpired) {
          setIsAuthenticated(true);
          setState((prevState) => ({
            ...prevState,
            user: userDataFromToken,
            loading: false,
          }));
        } else {
          localStorage.removeItem("token");
          setIsAuthenticated(false);
          setState((prevState) => ({
            ...prevState,
            user: null,
            loading: false,
          }));
        }
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        setState((prevState) => ({
          ...prevState,
          user: null,
          loading: false,
        }));
      }
    } else {
      setIsAuthenticated(false);
      setState((prevState) => ({
        ...prevState,
        user: null,
        loading: false,
      }));
    }
  }, []);

  const login = async (data) => {
    setState((prevState) => ({ ...prevState, loading: true }));

    try {
      const result = await axios.post(`${apiBaseUrl}/api/auth/login`, data);

      const token = result.data.token;
      localStorage.setItem("token", token);
      const userDataFromToken = jwtDecode(token);

      setState((prevState) => ({
        ...prevState,
        loading: false,
        user: userDataFromToken,
        success: result.data?.message,
        error: null,
      }));

      setIsAuthenticated(true);
      router.push("/");
    } catch (error) {
      setState((prevState) => ({
        ...prevState,
        loading: false,
        error: error.response?.data?.message || "Login failed",
      }));
    }
  };

  const register = async (data) => {
    try {
      await axios.post("/api/auth/register", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      router.push("/login");
    } catch (error) {
      console.error(
        "Registration failed:",
        error.response?.data || error.message,
      );
    }
  };

  const logout = () => {
    localStorage.removeItem("token");

    setState({
      ...state,
      success: "Logout successful.",
      error: null,
      user: null,
    });

    setIsAuthenticated(false);
    router.push("/");
  };

  const deleteuser = async (id) => {
    try {
      localStorage.removeItem("token");
      setState({
        ...state,
        success: "Delete account successful.",
        error: null,
        user: null,
      });

      await axios.delete(`${apiBaseUrl}/api/users/profile/${id}`);

      setIsAuthenticated(false);
      router.push("/");
    } catch (error) {
      console.log(
        "Delete account failed:",
        error.response?.data || error.message,
      );
    }
  };

  return (
    <AuthContext.Provider
      value={{ state, login, logout, register, deleteuser, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
}

const useAuth = () => React.useContext(AuthContext);

export { AuthProvider, useAuth };
