import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuthContext';

// firestore
import { collection, doc } from '@firebase/firestore';
import { db } from '../../firebase/init';
import { useSubdocument } from '../../hooks/useSubdocument';

// components
import ConversationHistory from './ConversationHistory';
import GenerateMessages from './GenerateMessages';

// styles
import './Conversation.css';
import avatar from '../../assets/avatar.jpg'

export default function Conversation() {
  const { user } = useAuthContext();
  const nav = useNavigate();
  const [modalActive, setModalActive] = useState('');

  // fetch conversation
  const { conversationID } = useParams();
  const [conversationRef, setConversationRef] = useState(null);
  const { document: conversationDoc } = useSubdocument(conversationRef);

  // update converation details upon fetch
  const [conversationName, setConversationName] = useState('');
  const [profilePhotoSrc, setProfilePhotoSrc] = useState(avatar);
  const [messageHistory, setMessageHistory] = useState([]);

  useEffect(() => {
    if (!user) {
      nav('/');
      return;
    }

    const userDocRef = doc(db, 'users', user.uid);
    const conversationsRef = collection(userDocRef, 'conversations');
    const conversationRef = doc(conversationsRef, conversationID);
    setConversationRef(conversationRef);
  }, [user, nav, conversationID]);

  useEffect(() => {
    if (!conversationDoc) return;
    const { profilePhotoSrc, name, messages } = conversationDoc;
    setProfilePhotoSrc(profilePhotoSrc || avatar);
    setConversationName(name);
    setMessageHistory(messages);
  }, [conversationDoc]);

  return (
    <div className='view-conversation container'>
      <nav>
        <Link to='/' className='profile'>
          <img src={profilePhotoSrc} alt='' className='profile-photo' />
          <h2>{conversationName}</h2>
        </Link>
        <Link to='/' className='house-icon-wrapper'>
          <i className='fa-solid fa-house'></i>
        </Link>
      </nav>
      <main>
        <ConversationHistory
          messageHistory={messageHistory}
          conversationRef={conversationRef}
          modalActive={modalActive}
          setModalActive={setModalActive}
        />
        <GenerateMessages
          messageHistory={messageHistory}
          modalActive={modalActive}
          setModalActive={setModalActive}
        />
      </main>
    </div>
  );
}
