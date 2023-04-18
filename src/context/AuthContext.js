import { onAuthStateChanged } from 'firebase/auth';
import { createContext, useEffect, useState } from 'react';
import { auth } from '../firebase/init';

export const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  const [authContext, setAuthContext] = useState({
    user: null,
    authIsReady: false,
  });

  // auto login on mount, then unsub listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setAuthContext({
        user,
        authIsReady: true,
      });
    });
    unsub();
  }, []);

  return (
    <AuthContext.Provider value={{ ...authContext, setAuthContext }}>
      {children}
    </AuthContext.Provider>
  );
}
