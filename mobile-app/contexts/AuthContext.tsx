import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { storage, User } from "@/utils/storage";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const savedUser = await storage.getUser();
      if (savedUser) {
        setUser(savedUser);
      }
    } catch (error) {
      console.error("Error loading user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const savedUser = await storage.getUser();
      if (savedUser && savedUser.email === email) {
        setUser(savedUser);
        await storage.setAuthToken(generateId());
      } else {
        const newUser: User = {
          id: generateId(),
          email,
          name: email.split("@")[0],
          createdAt: new Date().toISOString(),
        };
        await storage.setUser(newUser);
        await storage.setAuthToken(generateId());
        setUser(newUser);
      }
    } catch (error) {
      console.error("Login error:", error);
      throw new Error("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newUser: User = {
        id: generateId(),
        email,
        name,
        createdAt: new Date().toISOString(),
      };
      await storage.setUser(newUser);
      await storage.setAuthToken(generateId());
      setUser(newUser);
    } catch (error) {
      console.error("Signup error:", error);
      throw new Error("Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await storage.clearUserData();
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return;
    try {
      const updatedUser = { ...user, ...updates };
      await storage.setUser(updatedUser);
      setUser(updatedUser);
    } catch (error) {
      console.error("Update user error:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
