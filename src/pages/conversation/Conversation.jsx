import { collection, doc } from '@firebase/firestore';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { db } from '../../firebase/init';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useSubdocument } from '../../hooks/useSubdocument';
import './Conversation.css';

export default function Conversation() {
  const { conversationID } = useParams();
  const { user } = useAuthContext();
  const [conversationsRef, setConversationsRef] = useState(null);
  const nav = useNavigate();
  const { document: conversationDoc } = useSubdocument(conversationsRef, conversationID);

  useEffect(() => {
    if (!user) nav('/');

    const usersRef = collection(db, 'users');
    const userDocRef = doc(usersRef, user.uid);
    const conversationsRef = collection(userDocRef, 'conversations');
    setConversationsRef(conversationsRef);
  }, [user, nav]);

  return (
    <div className='conversation'>
      <nav>
        <Link to='/'>
          <i className='fa-solid fa-house'></i>
        </Link>
      </nav>
    </div>
  );
}
