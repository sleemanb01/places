import { createContext, useState } from "react";
import { ICtx, IUser } from "../typing/interfaces";

export const AuthContext = createContext<ICtx>({
  isLoggedIn: false,
  user: undefined,
  login: () => {},
  updatePerson: () => {},
  logout: () => {},
});

export function AuthContextProvider({ children }: { children: JSX.Element }) {
  const [auth, setAuth] = useState<IUser | undefined>(undefined);

  function login(user: IUser) {
    setAuth(user);
  }

  function updatePerson(user: IUser) {
    setAuth(user);
  }

  function logout() {
    setAuth(undefined);
  }

  const value: ICtx = {
    isLoggedIn: !!auth,
    user: auth,
    login: login,
    updatePerson: updatePerson,
    logout: logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
