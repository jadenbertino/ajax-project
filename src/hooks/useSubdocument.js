import { doc, onSnapshot } from '@firebase/firestore';
import { useEffect, useState } from 'react';

export function useSubdocument(collectionRef, docID) {
  const [document, setDocument] = useState(null);
  const [error, setError] = useState(null);

  // realtime data for doc
  useEffect(() => {
    if (!docID || !collectionRef) return;

    const conversationDocRef = doc(collectionRef, docID)
    const unsub = onSnapshot(conversationDocRef, (doc) => {
      if (!doc.data()) throw new Error(`No document with ID ${docID} in ${collectionRef} collection`)
      setDocument({...doc.data(), id: doc.id})
      setError(null)
    }, (err) => {
      console.log(err.message)
      setError(err.message)
    })
    return () => unsub();

  }, [collectionRef, docID]);

  return { document, error };
}
