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
  const [profilePhotoSrc, setProfilePhotoSrc] = useState('./avatar.jpg');
  const [conversationName, setConversationName] = useState('')
  console.log(conversationDoc);

  useEffect(() => {
    if (!user) {
      nav('/');
      return;
    }

    const usersRef = collection(db, 'users');
    const userDocRef = doc(usersRef, user.uid);
    const conversationsRef = collection(userDocRef, 'conversations');
    setConversationsRef(conversationsRef);
  }, [user, nav]);

  useEffect(() => {
    if (!conversationDoc) return;
    const { profilePhotoSrc, name } = conversationDoc
    setProfilePhotoSrc(profilePhotoSrc);
    setConversationName(name)
  }, [conversationDoc]);

  return (
    <div className='conversation'>
      <div className='container'>
        <nav>
          <img src={profilePhotoSrc} alt='' className='profile-photo' />
          <h2 className='name'>{conversationName}</h2>
          <Link to='/' className='house-icon-wrapper'>
            <i className='fa-solid fa-house'></i>
          </Link>
        </nav>
        <main>
          
        </main>
      </div>
    </div>
  );
}
