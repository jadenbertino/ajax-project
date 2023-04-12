import { signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../firebase/init";
import { useAuthContext } from "./useAuthContext";

export function useSignOut() {
  const [error, setError] = useState(null)
  const [pending, setPending] = useState(false)
  const [mounted, setMounted] = useState(true)
  const { setAuthContext } = useAuthContext()

	// lowercase names because some of the firebase functions are pascalCase
  async function signout() {
    setError(null)
    setPending(true)

    try {
      // sign out user
      await signOut(auth)
      setAuthContext((prev) => ({...prev, user: null}))

      // only do state updates if mounted
      if (mounted) {
        setError(null)
        setPending(false)
      }
      
    } catch (err) {
      // only do state updates if mounted
      if (mounted) {
        console.log(err.message)
        setError(err.message)
        setPending(false)
      }
    }
  }
  
  useEffect(() => {
    return () => setMounted(false)
  }, [])

  return { signOut, error, pending }
}