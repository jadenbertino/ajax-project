import { useEffect, useState } from "react";
import { auth } from "../firebase/init";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useAuthContext } from "./useAuthContext";

export function useSignUp() {
  const [error, setError] = useState(null)
  const [pending, setPending] = useState(false)
  const [isMounted, setIsMounted] = useState(true)
  const { setAuthContext } = useAuthContext()

	// lowercase names because some of the firebase functions are pascalCase
  async function signup(displayName, email, password) {
    setError(null)
    setPending(true)

    try {
      // signup user
      const response = await createUserWithEmailAndPassword(auth, email, password)

      if (!response) {
        throw new Error("Couldn't sign up user")
      }

      // add display name
      await updateProfile(response.user, {displayName})

      const user = response.user

      // update context
      setAuthContext(prev => ({...prev, user }))
      
      if (isMounted) {
        setPending(false)
        setError(null)
      }
      
    } catch (err) {
      if (isMounted) {
        console.log(err)
        setError(err.message)
        setPending(false)
      }
    }
  }

  // only update state if component is mounted
  useEffect(() => {
    return () => setIsMounted(false)
  }, [])
  
  return { error, pending, signUp }
}