import { createContext, useState } from "react";
import { AuthCtx, userWToken } from "../typing/types";

export const AuthContext = createContext<AuthCtx>({
  isLoggedIn: false,
  user: undefined,
  login: () => {},
  updatePerson: () => {},
  logout: () => {},
});

export function AuthContextProvider({ children }: { children: JSX.Element }) {
  const [auth, setAuth] = useState<userWToken | undefined>(undefined);

  function login(user: userWToken) {
    setAuth(user);
  }

  function updatePerson(user: userWToken) {
    setAuth(user);
  }

  function logout() {
    setAuth(undefined);
  }

  const value: AuthCtx = {
    isLoggedIn: !!auth,
    user: auth,
    login: login,
    updatePerson: updatePerson,
    logout: logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
