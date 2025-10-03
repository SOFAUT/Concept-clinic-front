import { type ReactNode, createContext, useContext } from "react";
import { useAppSelector, useAppDispatch } from "../../core/store/hooks";
import {
  setCredentials,
  clearCredentials,
} from "../../core/store/slices/authSlice";
import type { User } from "../../interfaces/authInterfaces";

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  setCredentials: (credentials: {
    accessToken: string;
    refreshToken: string;
    user: User;
  }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const refreshToken = useAppSelector((state) => state.auth.refreshToken);
  const user = useAppSelector((state) => state.auth.user);


  const setCredentialsHandler = (credentials: {
    accessToken: string;
    refreshToken: string;
    user: User;
  }) => {
    dispatch(setCredentials(credentials));
  };

  const logoutHandler = () => {
    dispatch(clearCredentials());
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        refreshToken,
        user: user ?? null,
        setCredentials: setCredentialsHandler,
        logout: logoutHandler,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
};
