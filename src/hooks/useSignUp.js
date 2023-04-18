import { useEffect, useState } from "react";
import { auth, db } from "../firebase/init";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useAuthContext } from "./useAuthContext";
import { doc, setDoc } from "firebase/firestore";

export function useSignUp() {
  const [error, setError] = useState(null)
  const [pending, setPending] = useState(false)
  const [isMounted, setIsMounted] = useState(true)
  const { setAuthContext } = useAuthContext()

  async function signup(displayName, email, password) {
    setError(null)
    setPending(true)

    try {
      const response = await createUserWithEmailAndPassword(auth, email, password)

      if (!response) {
        throw new Error("Couldn't sign up user")
      }

      const user = response.user
      await updateProfile(user, {displayName})
      const docRef = doc(db, "users", user.uid)
      const userDoc = {
        email: user.email,
        apiKey: '',
        tokensUsed: 0,
        gender: '',
      }
      await setDoc(docRef, userDoc)

      setAuthContext(prev => ({...prev, user }))
      
      if (isMounted) {
        setPending(false)
        setError(null)
      }
      
    } catch (err) {
      if (isMounted) {
        console.log(err.message)
        setError(err.message)
        setPending(false)
      }
    }
  }

  // only update state if component is mounted
  useEffect(() => {
    return () => setIsMounted(false)
  }, [])
  
  return { error, pending, signup }
}