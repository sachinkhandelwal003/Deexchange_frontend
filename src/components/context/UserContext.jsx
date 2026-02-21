import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Auto load profile if token exists
  useEffect(() => {
    const token = localStorage.getItem("userToken")||localStorage.getItem("adminToken");

    if (token) {
      fetchProfile(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchProfile = async (token) => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/users/get-profile",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("profiledata",res.data)
      if (res.data.success) {
        setUser(res.data.data);
        localStorage.setItem(
          "userProfile",
          JSON.stringify(res.data.data)
        );
      }
    } catch (err) {
      console.error("Profile load failed");
      localStorage.removeItem("userToken");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, fetchProfile, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
