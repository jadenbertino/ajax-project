import { useEffect, useState } from "react";
import { collection, onSnapshot,  } from "firebase/firestore";

export function useSubcollection(parentDocRef, subcollectionName) {
  const [docs, setDocs] = useState([])
  const [pending, setPending] = useState(true)

  useEffect(() => {
    if (!parentDocRef || !subcollectionName) return
    
    setPending(true)
    const subCollectionRef = collection(parentDocRef, subcollectionName)

    const unsub = onSnapshot(subCollectionRef, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id}))
      setDocs(docs)
      setPending(false)
    })

    return unsub

  }, [parentDocRef, subcollectionName])

  return { docs, pending }
}