import { useState, useCallback, useEffect } from "react";
import { useHistory } from "react-router-dom";

let logoutTimer;

export function useAuth() {
  // originally "null"
  // at one point I changed it to JSON.parse(localStorage.getItem("userData")) but it resulted in the program treating 'null' as a valid token

  // let browserStorage = JSON.parse(localStorage.getItem("userData"));
  // const [token, setToken] = useState(browserStorage && browserStorage.token);

  const [token, setToken] = useState(null);

  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const [userId, setUserId] = useState(null);

  const login = useCallback((uid, token, expirationDate) => {
    setToken(token);
    setUserId(uid);
    const tokenExpiration =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);

    // For testing purposes - logs out after 10 seconds
    // const tokenExpiration =
    //   expirationDate || new Date(new Date().getTime() + 10000);

    setTokenExpirationDate(tokenExpiration);

    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: uid,
        token,
        expiration: tokenExpiration.toISOString(),
      })
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setTokenExpirationDate(null);
    setUserId(null);
    localStorage.removeItem("userData");
  }, []);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(
        storedData.userId,
        storedData.token,
        new Date(storedData.expiration)
      );
    }
  }, [login]);

  return { token, login, logout, userId };
}
