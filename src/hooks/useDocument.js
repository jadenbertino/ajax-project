import { useEffect, useState } from "react";
import { db } from "../firebase/init";
import { doc, onSnapshot } from "firebase/firestore";

export function useDocument(collectionName, id) {
  const [document, setDocument] = useState(null)
  const [error, setError] = useState(null)

  // realtime data for doc
  useEffect(() => {
    const ref = doc(db, collectionName, id)
    const unsub = onSnapshot(ref, (doc) => {
      if (doc.data()) {
        setDocument({...doc.data(), id: doc.id})
        setError(null)
      } else {
        setError('no such document exists')
      }
    }, (err) => {
      console.log(err.message)
      setError('failed to get document')
    })
    return () => unsub()
  }, [collectionName, id])

  return { document, error }
}