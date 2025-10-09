import { type ReactNode, useEffect } from "react";
import { useAppSelector } from "../store/hooks";
import { useNavigate } from "react-router";
import { APP_ROUTES } from "../../util/constants";

interface AuthMiddlewareProps {
  children: ReactNode;
}

export const AuthMiddleware = ({ children }: AuthMiddlewareProps) => {
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const navigate = useNavigate();

  useEffect(() => {
    if (!accessToken) {
      console.log('🔒 Usuário não autenticado, redirecionando para login');
      navigate(APP_ROUTES.LOGIN);
    }
  }, [accessToken, navigate]);

  // Se não tem token, não renderiza nada (vai redirecionar)
  if (!accessToken) {
    return null;
  }

  return <>{children}</>;
};
