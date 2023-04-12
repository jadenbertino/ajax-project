import { signInWithEmailAndPassword } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../firebase/init";
import { useAuthContext } from "./useAuthContext";

export function useSignIn() {
  const [error, setError] = useState(null)
  const [pending, setPending] = useState(false)
  const [mounted, setMounted] = useState(true)
  const { setAuthContext } = useAuthContext()
	
	// lowercase names because some of the firebase functions are pascalCase
  async function signin(email, password) {
    setError(null)
    setPending(true)

    try {
      // sign in user
      const res = await signInWithEmailAndPassword(auth, email, password)
      const user = res.user
      setAuthContext((prev) => ({...prev, user}))

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

  return { signin, error, pending }
}