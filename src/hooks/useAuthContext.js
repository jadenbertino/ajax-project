import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export function useAuthContext() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('AuthContext must be accessed within a AuthContextProvider')
  }

  return context
}