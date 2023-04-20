import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuthContext';

// firestore
import { Timestamp, collection, doc, getDoc, setDoc } from '@firebase/firestore';
import { db } from '../../firebase/init';
import { useSubdocument } from '../../hooks/useSubdocument';

// components
import Modal from '../../components/Modal';
import RenderMessages from './RenderMessages';

// styles
import './Conversation.css';

export default function Conversation() {
  const { user } = useAuthContext();
  const nav = useNavigate();
  const [modalPrompt, setModalPrompt] = useState(null);
  const [newMessageText, setNewMessageText] = useState('');

  // fetch conversation
  const { conversationID } = useParams();
  const [conversationsRef, setConversationsRef] = useState(null);
  const { document: conversationDoc } = useSubdocument(conversationsRef, conversationID);
  const [conversationName, setConversationName] = useState('');
  const [profilePhotoSrc, setProfilePhotoSrc] = useState('/avatar.jpg');
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [generatedMessages, setGeneratedMessages] = useState([]);

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
    const { profilePhotoSrc, name, messages } = conversationDoc;
    setProfilePhotoSrc(profilePhotoSrc || '/avatar.jpg');
    setConversationName(name);
    setMessages(messages);
  }, [conversationDoc]);

  async function handleNewMessage(e) {
    e.preventDefault();
    try {
      const messageType = modalPrompt === 'Add Her Message' ? 'RECEIVED' : 'SENT';
      const message = {
        type: messageType,
        textContent: newMessageText,
        timestamp: Timestamp.now(),
      };

      // add message to firestore
      const conversationRef = doc(conversationsRef, conversationID);
      const conversationSnap = await getDoc(conversationRef);
      if (!conversationSnap.exists()) throw new Error('Invalid document ID');
      const { messages } = conversationSnap.data();
      messages.push(message);
      await setDoc(conversationRef, { messages }, { merge: true });

      setNewMessageText('');
      closeModal();
    } catch (err) {
      console.log(err.message);
      closeModal();
    }
  }

  async function handleMessageGeneration(e) {
    e.preventDefault()
    console.log(prompt)
  }

  function closeModal() {
    setNewMessageText('')
    setModalPrompt(null);
  }

  return (
    <>
      <div className='view-conversation container'>
        <nav>
          <Link to="/" className="profile">
            <img src={profilePhotoSrc} alt='' className='profile-photo' />
            <h2>{conversationName}</h2>
          </Link>
          <Link to='/' className='house-icon-wrapper'>
            <i className='fa-solid fa-house'></i>
          </Link>
        </nav>

        <div className="conversation-history">
          <RenderMessages messages={messages} />
          <div className='new-message-btns'>
            <button className='btn received' onClick={() => setModalPrompt('Add Her Message')}>
              Add Her Message
            </button>
            <button className='btn sent' onClick={() => setModalPrompt('Add Your Message')}>
              Add Your Message
            </button>
          </div>
        </div>

        <div className='generate-message'>
          <form onSubmit={handleMessageGeneration}>
            <label>
              <span>Prompt:</span>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </label>
            <button className="btn">Generate Rizz!</button>
          </form>
        </div>
      </div>
      
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
              onChange={(e) => setNewMessageText(e.target.value)}
              value={newMessageText}
              required
              autoFocus
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
    </>
  );
}
