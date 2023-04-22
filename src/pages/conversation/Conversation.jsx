import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuthContext';

// firestore
import { collection, doc } from '@firebase/firestore';
import { db } from '../../firebase/init';
import { useSubdocument } from '../../hooks/useSubdocument';

// components
import AddNewMessageModal from './AddNewMessageModal';
import GenerateMessages from './GenerateMessages';
import RenderMessages from './RenderMessages';

// styles
import './Conversation.css';

export default function Conversation() {
  const { user } = useAuthContext();
  const nav = useNavigate();
  const [modalActive, setModalActive] = useState('');

  // fetch conversation
  const { conversationID } = useParams();
  const [conversationRef, setConversationRef] = useState(null);
  const { document: conversationDoc } = useSubdocument(conversationRef);
  const [conversationName, setConversationName] = useState('');
  const [profilePhotoSrc, setProfilePhotoSrc] = useState('/avatar.jpg');
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
    setProfilePhotoSrc(profilePhotoSrc || '/avatar.jpg');
    setConversationName(name);
    setMessageHistory(messages);
  }, [conversationDoc]);

  function closeModal() {
    setModalActive('');
  }

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
        <div className='conversation-history'>
          <RenderMessages messages={messageHistory} />
          <div className='new-message-btns'>
            <button className='btn received' onClick={() => setModalActive('ADD_RECEIVED_MESSAGE')}>
              Add Her Message
            </button>
            <button className='btn sent' onClick={() => setModalActive('ADD_SENT_MESSAGE')}>
              Add Your Message
            </button>
          </div>
          {(modalActive === 'ADD_SENT_MESSAGE' || modalActive === 'ADD_RECEIVED_MESSAGE') && (
            <AddNewMessageModal
              closeModal={closeModal}
              modalActive={modalActive}
              conversationRef={conversationRef}
            />
          )}
        </div>
        <GenerateMessages
          messageHistory={messageHistory}
          modalActive={modalActive}
          setModalActive={setModalActive}
        />
      </main>
    </div>
  );
}
