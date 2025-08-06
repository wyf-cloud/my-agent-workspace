import { createContext, useState, useEffect, ReactNode, createElement } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // 从localStorage加载认证状态
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  // 当认证状态变化时保存到localStorage
  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated.toString());
  }, [isAuthenticated]);

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
  };

  // 使用createElement代替JSX以避免.ts文件中的语法错误
  return createElement(
    AuthContext.Provider,
    { value: { isAuthenticated, setIsAuthenticated, logout } },
    children
  );
};