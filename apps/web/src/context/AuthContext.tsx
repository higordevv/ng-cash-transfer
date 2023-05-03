import React, { useCallback, useContext, useEffect, useState } from "react";
import { destroyCookie, parseCookies } from "nookies";
import { recoverUserInfo } from "../service/api";

type User = {
  user_id: string;
  username: string;
  password: string;
  account: {
    id: string;
    balance: number;
  };
};

type AuthContextType = {
  user: User | null;
  authenticated: boolean;
  logout: () => void;
  isLoading: boolean;
};
const AuthContext = React.createContext<AuthContextType>({
  user: null,
  logout: () => {},
  authenticated: false,
  isLoading: false,
});

function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const cookies = parseCookies();
  const { Authorization: token } = cookies;

  const [user, setUser] = useState<User | null>(null);
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const recoverUser = useCallback(async () => {
    if (token) {
        console.log(token);
      setIsLoading(true);
      setAuthenticated(true);
      try {
        const response = await recoverUserInfo();
        console.log(response);
        setUser(response.data);
      } catch (error) {
        console.error("Erro ao recuperar informações do usuário:", error);
      }
      setIsLoading(false); // definir isLoading como false para esconder o indicador de carregamento
    }
  }, [token, cookies]);

  useEffect(() => {
    recoverUser();
  }, [recoverUser]);

  const logout = useCallback(() => {
    destroyCookie(null, "Authorization");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, authenticated, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => useContext(AuthContext);

export default AuthContextProvider;
