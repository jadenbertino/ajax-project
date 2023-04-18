import { Timestamp, collection, doc, getDoc, setDoc } from '@firebase/firestore';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Modal from '../../components/Modal';
import { db } from '../../firebase/init';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useSubdocument } from '../../hooks/useSubdocument';
import './Conversation.css';
import RenderConversation from './RenderConversation';

export default function Conversation() {
  const { conversationID } = useParams();
  const { user } = useAuthContext();
  const [conversationsRef, setConversationsRef] = useState(null);
  const nav = useNavigate();
  const { document: conversationDoc } = useSubdocument(conversationsRef, conversationID);
  const [profilePhotoSrc, setProfilePhotoSrc] = useState('./avatar.jpg');
  const [conversationName, setConversationName] = useState('');
  const [modalPrompt, setModalPrompt] = useState(null);
  const [messageContent, setMessageContent] = useState('');
  const [conversationContent, setConversationContent] = useState([]);

  useEffect(() => {
    if (!user) {
      nav('/');
      return;
    }

    const userDocRef = doc(db, 'users', user.uid);
    const conversationsRef = collection(userDocRef, 'conversations');
    setConversationsRef(conversationsRef);
  }, [user, nav]);

  useEffect(() => {
    if (!conversationDoc) return;
    const { profilePhotoSrc, name, conversationContent } = conversationDoc;
    setProfilePhotoSrc(profilePhotoSrc);
    setConversationName(name);
    setConversationContent(conversationContent);
  }, [conversationDoc]);

  async function handleNewMessage(e) {
    e.preventDefault();
    try {
      // create message
      const messageType = modalPrompt === 'Add Her Message' ? 'RECEIVED' : 'SENT';
      const message = {
        type: messageType,
        message: messageContent,
        timestamp: Timestamp.now()
      };

      // add message to firestore
      const conversationRef = doc(conversationsRef, conversationID);
      const conversationSnap = await getDoc(conversationRef);
      if (!conversationSnap.exists()) throw new Error('Invalid document ID');
      const { conversationContent } = conversationSnap.data();
      conversationContent.push(message);
      await setDoc(conversationRef, { conversationContent }, { merge: true });

      // reset message content + close modal
      setMessageContent('');
      closeModal();
    } catch (err) {
      console.log(err.message);
      closeModal();
    }
  }

  function closeModal() {
    setModalPrompt(null);
  }

  return (
    <div className='view-conversation container'>
      <nav>
        <img src={profilePhotoSrc} alt='' className='profile-photo' />
        <h2 className='name'>{conversationName}</h2>
        <Link to='/' className='house-icon-wrapper'>
          <i className='fa-solid fa-house'></i>
        </Link>
      </nav>
      <main>
        <div className='history'>
          <RenderConversation conversationContent={conversationContent}/>
          <div className='new-message-btns'>
            <div className='btn received' onClick={() => setModalPrompt('Add Her Message')}>
              Add Her Message
            </div>
            <div className='btn sent' onClick={() => setModalPrompt('Add Your Message')}>
              Add Your Message
            </div>
          </div>
        </div>
        <div className='message-generation'>{/* for later */}</div>
      </main>
      {modalPrompt && (
        <Modal closeModal={closeModal}>
          <form
            onSubmit={handleNewMessage}
            className={`new-message-form ${
              modalPrompt === 'Add Her Message' ? 'received' : 'sent'
            }`}
          >
            <h2>{modalPrompt}</h2>
            <textarea
              onChange={(e) => setMessageContent(e.target.value)}
              value={messageContent}
              required
            />
            <div className='btns'>
              <button className='btn cancel' type='button' onClick={closeModal}>
                Cancel
              </button>
              <button className='btn submit'>Add New Message</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
