import { doc, onSnapshot } from '@firebase/firestore';
import { useEffect, useState } from 'react';

export function useSubdocument(docRef) {
  const [document, setDocument] = useState(null);
  const [error, setError] = useState(null);

  // realtime data for doc
  useEffect(() => {
    if (!docRef) return;

    const unsub = onSnapshot(docRef, (doc) => {
      if (!doc.data()) throw new Error(`Document not found`)
      setDocument({...doc.data(), id: doc.id})
      setError(null)
    }, (err) => {
      console.log(err.message)
      setError(err.message)
    })
    return () => unsub();

  }, [docRef]);

  return { document, error };
}
