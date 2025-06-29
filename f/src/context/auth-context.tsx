import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useTheme } from "@/context/theme-context";

export type UserType = {
  id: number;
  email: string;
  username: string;
};

export type AuthContextType = {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  logout: () => void;
  initialize: (token: string | null, user?: UserType | null) => void;
  user: UserType | null;
  setUser: (user: UserType | null) => void;
  isLoading: boolean;
  refreshAccessToken: () => Promise<boolean>;
  authenticatedFetch: (url: string, options?: RequestInit) => Promise<Response>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { resetTheme } = useTheme();

  // Refresh token ile yeni access token alma
  const refreshAccessToken = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch("/api/refresh", {
        method: "POST",
        credentials: "include", // HTTP-only cookie'yi gönder
      });
      
      if (response.ok) {
        const data = await response.json();
        setAccessToken(data.accessToken);
        return true;
      } else {
        // Refresh token geçersiz, logout yap
        logout();
        return false;
      }
    } catch (error) {
      console.error("Token yenileme hatası:", error);
      logout();
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    setAccessToken(null);
    setUser(null);
    // Tema class'larını temizle
    document.documentElement.classList.remove("dark", "light");
    // localStorage'dan tema bilgisini sil
    localStorage.removeItem("theme");
    resetTheme();
    // Çıkışta backend'e refreshToken silinsin diye istek atılabilir
    fetch("/api/logout", { method: "POST", credentials: "include" });
  }, [resetTheme]);

  // Authenticated fetch fonksiyonu - token expire olduğunda otomatik yeniler
  const authenticatedFetch = useCallback(async (url: string, options: RequestInit = {}) => {
    const fetchWithToken = async (token: string | null) => {
      const headers = {
        ...options.headers,
        ...(token && { Authorization: `Bearer ${token}` }),
      };

      return fetch(url, {
        ...options,
        headers,
        credentials: "include",
      });
    };

    // İlk isteği yap
    let response = await fetchWithToken(accessToken);

    // Eğer 401 hatası alırsak ve access token varsa, token'ı yenilemeyi dene
    if (response.status === 401 && accessToken) {
      const refreshSuccess = await refreshAccessToken();
      if (refreshSuccess) {
        // Yeni token ile tekrar istek yap
        response = await fetchWithToken(accessToken);
      }
    }

    return response;
  }, [accessToken, refreshAccessToken]);

  // Sayfa yüklendiğinde authentication state'ini kontrol et
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Önce refresh token ile yeni access token almayı dene
        const success = await refreshAccessToken();
        if (success) {
          // Access token alındıysa kullanıcı bilgilerini de al
          const userResponse = await authenticatedFetch("/api/profile");
          if (userResponse.ok) {
            const userData = await userResponse.json();
            setUser(userData);
          }
        }
      } catch (error) {
        console.error("Authentication initialization error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [refreshAccessToken, authenticatedFetch]);

  const initialize = (token: string | null, userObj?: UserType | null) => {
    setAccessToken(token);
    if (userObj) setUser(userObj);
  };

  return (
    <AuthContext.Provider value={{ 
      accessToken, 
      setAccessToken, 
      logout, 
      initialize, 
      user, 
      setUser, 
      isLoading,
      refreshAccessToken,
      authenticatedFetch
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth, AuthProvider İçinde kullanılmalı");
  return ctx;
};
