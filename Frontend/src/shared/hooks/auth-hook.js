import { useState, useCallback, useEffect } from "react";

let logoutTimer;

export function useAuth() {
  // originally "null"
  // at one point I changed it to localStorage.getItem("userData") but it resulted in the program treating 'null' as a valid token because
  // I forgot to add JSON.parse()

  let browserStorage = JSON.parse(localStorage.getItem("userData"));

  const [token, setToken] = useState(browserStorage && browserStorage.token);
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

  console.log(token);
  console.log(tokenExpirationDate);

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
