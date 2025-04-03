import { useState, useEffect } from "react";
import { AuthContext } from ".";
import useLocalStorage from "../hooks/useLocalStorage";
import { authenticateUser } from "../api/auth";

export default function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useLocalStorage(
    "instashotsToken",
    null
  );
  const [user, setUser] = useState({
    isError: null,
    data: null,
    isAuthenticated: false,
  });
  const [isCheckingAuth, setIsCheckingAuth] = useState(false);

  useEffect(() => {
    if (!accessToken) return;
    const getUser = async () => {
      try {
        setIsCheckingAuth(true);
        const res = await authenticateUser(accessToken);
        if (res.status === 200) {
          setUser((prev) => ({
            ...prev,
            data: res.data,
            isAuthenticated: true,
          }));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsCheckingAuth(false);
      }
    };
    getUser();
  }, [accessToken]);
  
  console.log(user);
  return (
    <AuthContext.Provider
      value={{ accessToken, setAccessToken, user, isCheckingAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
}
