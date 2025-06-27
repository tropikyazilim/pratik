import React, { createContext, useContext, useState } from "react";

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
  // refreshAccessToken fonksiyonu burada tanımlanabilir
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserType | null>(null);

  const logout = () => {
    setAccessToken(null);
    setUser(null);
    // Tema class'larını temizle
    document.documentElement.classList.remove("dark", "light");
    // localStorage'dan tema bilgisini sil
    localStorage.removeItem("theme");
    // Çıkışta backend'e refreshToken silinsin diye istek atılabilir
    fetch("/api/logout", { method: "POST", credentials: "include" });
  };

  const initialize = (token: string | null, userObj?: UserType | null) => {
    setAccessToken(token);
    if (userObj) setUser(userObj);
  };

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, logout, initialize, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth, AuthProvider İçinde kullanılmalı");
  return ctx;
};
