"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import api from "@/lib/api";
import { User } from "@/types";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { getSession, signOut } from "@/lib/actions/auth-actions";

// Define auth context interface
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logIn: (user: any) => Promise<void>;
  logOut: () => Promise<void>;
  refreshUserData: () => Promise<void>;
  updateUserProfile: (profileData: Partial<User>) => Promise<void>;
  deleteAccount: () => Promise<void>;
  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<void>;
}

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  logIn: async () => { },
  logOut: async () => { },
  refreshUserData: async () => { },
  updateUserProfile: async () => { },
  deleteAccount: async () => { },
  changePassword: async () => { },
});

// Hook for using the auth context
export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Usage in your AuthProvider
  const checkSession = async () => {
    let _user = null as null | User;

    try {
      setIsLoading(true);
      const result = await getSession();
      const userId = result?.session?.userId;

      if (!userId) {
        setUser(null);
        return;
      }

      if (userId) {
        try {
          const response = await api.get("/api/partners/users/" + userId);
          setUser(response.data.user);
          _user = response.data.user;
        } catch (e) {
          setUser(null);
          console.error("Failed to fetch user data:", e);
          toast.error("Erro ao carregar dados do usuário", {
            description:
              "Sua sessão pode ter expirado. Por favor, faça login novamente.",
          });
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
      console.error("Session check failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Check for existing session on load
  useEffect(() => {
    checkSession();
  }, []);

  // Sign in function
  const logIn = async (user: any) => {
    try {
      // Add default role if not present
      const userWithRole = {
        ...user,
        role: user.role || 'USER'
      };
      setUser(userWithRole);
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    }
  };

  // Sign out function
  const logOut = async () => {
    try {
      await signOut();
      localStorage.clear();
      setUser(null);

      // Show success message
      toast.success("Sessão encerrada com sucesso", {
        description: "Você foi desconectado do sistema.",
      });

      window.location.href = "/auth/signin";
    } catch (error) {
      console.error("Error during sign out:", error);
      toast.error("Erro ao encerrar sessão", {
        description: "Ocorreu um erro ao tentar desconectar. Tente novamente.",
      });
    }
  };

  // Refresh user data function
  const refreshUserData = async () => {
    const result = await getSession();
    const userId = result?.session?.userId;

    if (!userId) return;

    try {
      const response = await api.get("/api/users/" + userId);
      const subscriptionResponse = await api.get(
        "/api/subscriptions/" + userId
      );

      if (response.data?.user) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error("Failed to refresh user data:", error);
      throw error;
    }
  };

  // Update user profile function
  const updateUserProfile = async (profileData: any) => {
    const result = await getSession();
    const userId = result?.session?.userId;
    if (!userId) return;

    try {
      const response = await api.put("/api/users/" + userId, profileData);
      // Handle nested response structure
      if (response.data?.user) {
        // Update user state with the returned user data
        setUser((prev: User | null) =>
          prev ? { ...prev, ...response.data.user } : response.data.user
        );
      }
      return;
    } catch (error) {
      console.error("Failed to update user profile:", error);
      throw error;
    }
  };

  // Change password function
  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    try {
      // Make request to change password endpoint
      await api.post("/api/auth/change-password", {
        currentPassword,
        newPassword,
      });

      return;
    } catch (error: any) {
      console.error("Failed to change password:", error);

      // Handle specific error messages from the API
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }

      throw new Error("Falha ao alterar a senha. Tente novamente.");
    }
  };

  // Delete user account function
  const deleteAccount = async () => {
    try {
      // Get the token from session data

      if (!user?.id) {
        toast.error("Erro ao excluir conta", {
          description: "Usuário não autenticado. Faça login novamente.",
        });
        throw new Error("Auth token not found in session");
      }

      // Make delete request with token in header
      const response = await api.delete("/api/users/" + user?.id);

      // Clear local storage and state
      await signOut();
      localStorage.clear();
      setUser(null);

      toast.success("Conta excluída com sucesso", {
        description: "Sua conta foi desativada com sucesso.",
      });

      // Redirect to login page
      window.location.href = "/auth/sign-in";

      return response.data;
    } catch (error) {
      console.error("Failed to delete account:", error);
      toast.error("Erro ao excluir conta", {
        description:
          "Ocorreu um erro ao tentar excluir sua conta. Tente novamente.",
      });
      throw error;
    }
  };

  // Context value
  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    logIn,
    logOut,
    refreshUserData,
    updateUserProfile,
    deleteAccount,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
