import { doc, onSnapshot } from '@firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../firebase/init';

export function useDocument(collectionName, id) {
  const [document, setDocument] = useState(null);
  const [error, setError] = useState(null);
  
  // realtime data for doc
  useEffect(() => {
    if (!collectionName || !id) return;
    const ref = doc(db, collectionName, id);
    const unsub = onSnapshot(ref, (doc) => {
      if (!doc.data()) throw new Error(`No document with ID ${id} in ${collectionName} collection`)
      setDocument({...doc.data(), id: doc.id})
      setError(null)
    }, (err) => {
      console.log(err.message)
      setError(err.message)
    })
    return () => unsub();
  }, [collectionName, id]);

  return { document, error };
}
