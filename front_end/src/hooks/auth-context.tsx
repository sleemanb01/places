import { createContext, useCallback, useEffect, useState } from "react";
import { AuthCtx, userWToken } from "../typing/types";

let logoutTimer: ReturnType<typeof setTimeout>;

export const AuthContext = createContext<AuthCtx>({
  isLoggedIn: false,
  user: undefined,
  login: () => {},
  updatePerson: () => {},
  logout: () => {},
});

export function AuthContextProvider({ children }: { children: JSX.Element }) {
  const [auth, setAuth] = useState<userWToken | undefined>(undefined);
  const [tokenExpirationDate, setTokenExpirationDate] = useState<Date | null>();

  const login = useCallback((user: userWToken) => {
    localStorage.setItem("userData", JSON.stringify(user));
    setAuth(user);
    const tokenExpirationDate =
      user.tokenExpiration || new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpirationDate(tokenExpirationDate);
    localStorage.setItem(
      "userData",
      JSON.stringify({
        id: user.id,
        token: user.token,
        expiration: tokenExpirationDate.toISOString(),
      })
    );
  }, []);

  const updatePerson = useCallback((user: userWToken) => {
    setAuth(user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("userData");
    setAuth(undefined);
    setTokenExpirationDate(null);
  }, []);

  useEffect(() => {
    if (auth && auth.token && tokenExpirationDate) {
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [auth?.token, logout, tokenExpirationDate]);

  useEffect(() => {
    const storedData = localStorage.getItem("userData");
    if (storedData) {
      const data = JSON.parse(storedData);
      if (data && data.token && new Date(data.expiration) > new Date()) {
        const user = {
          id: data.id,
          email: data.email,
          token: data.token,
          tokenExpiration: new Date(data.expiration),
        };
        login(user);
      }
    }
  }, [login]);

  const value: AuthCtx = {
    isLoggedIn: !!auth,
    user: auth,
    login: login,
    updatePerson: updatePerson,
    logout: logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
