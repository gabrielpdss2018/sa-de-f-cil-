import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import api from "../services/api.js";

export type UserRole = "UC" | "UP" | "UE" | "UA";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  cpf?: string;
  phone?: string;
  cep?: string;
  street?: string;
  number?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  cnpj?: string;
  institutionName?: string;
  organizationName?: string;
  institutions?: any[];
  organization?: any;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  register: (newUser: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("@SaudeFacil:user");
    const storedToken = localStorage.getItem("@SaudeFacil:token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    const response = await api.post("/auth/login", { email, password });
    const { user, token } = response.data;

    localStorage.setItem("@SaudeFacil:user", JSON.stringify(user));
    localStorage.setItem("@SaudeFacil:token", token);

    setUser(user);
  };

  const register = async (userData: any): Promise<void> => {
    const response = await api.post("/auth/register", userData);
    const user = response.data;

    // Opcional: fazer login automático após registro
    // Por enquanto apenas registramos, o componente de Cadastro chamará o login
    return user;
  };

  const logout = () => {
    localStorage.removeItem("@SaudeFacil:user");
    localStorage.removeItem("@SaudeFacil:token");
    setUser(null);
  };

  const updateProfile = async (updates: Partial<User>) => {
    const response = await api.patch("/users/profile", updates);
    const updatedUser = response.data;

    localStorage.setItem("@SaudeFacil:user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, updateProfile, register }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
