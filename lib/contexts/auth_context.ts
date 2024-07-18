import { createContext } from "react";
import { AuthContextProps } from "../types";

// contexto de sesion de la app
const AuthContext = createContext<AuthContextProps>({
  auth: null,
  login: () => null,
  logout: () => null,
});

export default AuthContext;
