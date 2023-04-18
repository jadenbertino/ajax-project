import { signInWithEmailAndPassword } from '@firebase/auth';
import { useEffect, useState } from 'react';
import { auth } from '../firebase/init';
import { useAuthContext } from './useAuthContext';

export function useSignIn() {
  const [error, setError] = useState(null);
  const [pending, setPending] = useState(false);
  const [mounted, setMounted] = useState(true);
  const { setAuthContext } = useAuthContext();

  async function signin(email, password) {
    setError(null);
    setPending(true);

    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      const user = res.user;
      setAuthContext((prev) => ({ ...prev, user }));

      if (!mounted) return;
      setError(null);
      setPending(false);
    } catch (err) {
      if (!mounted) return;
      console.log(err.message);
      setError(err.message);
      setPending(false);
    }
  }

  useEffect(() => {
    return () => setMounted(false);
  }, []);

  return { signin, error, pending };
}
