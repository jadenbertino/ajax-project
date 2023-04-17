import { signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { auth } from '../firebase/init';
import { useAuthContext } from './useAuthContext';

export function useSignOut() {
  const [error, setError] = useState(null);
  const [pending, setPending] = useState(false);
  const [mounted, setMounted] = useState(true);
  const { setAuthContext } = useAuthContext();

  async function signout() {
    setError(null);
    setPending(true);

    try {
      await signOut(auth);
      setAuthContext((prev) => ({ ...prev, user: null }));

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

  return { signout, error, pending };
}
