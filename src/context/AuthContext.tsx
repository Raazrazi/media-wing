import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  adminUser: string | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Phase 1: hardcoded credentials — replace with server auth in Phase 2
const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "passthroughadmin",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem("union_admin_auth") === "true";
  });

  const [adminUser, setAdminUser] = useState<string | null>(() => {
    return localStorage.getItem("union_admin_user");
  });

  const login = (username: string, password: string): boolean => {
    if (
      username === ADMIN_CREDENTIALS.username &&
      password === ADMIN_CREDENTIALS.password
    ) {
      setIsAuthenticated(true);
      setAdminUser(username);
      localStorage.setItem("union_admin_auth", "true");
      localStorage.setItem("union_admin_user", username);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setAdminUser(null);
    localStorage.removeItem("union_admin_auth");
    localStorage.removeItem("union_admin_user");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, adminUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
