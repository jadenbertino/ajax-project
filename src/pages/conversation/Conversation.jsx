import { Configuration, OpenAIApi } from 'openai';
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

// openai
const OPEN_AI_API_KEY = process.env.REACT_APP_OPEN_AI_API_KEY;
const configuration = new Configuration({
  apiKey: OPEN_AI_API_KEY,
});
const openai = new OpenAIApi(configuration);

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
  const [messageHistory, setMessageHistory] = useState([]);
  const [userPrompt, setUserPrompt] = useState('');
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
    setMessageHistory(messages);
  }, [conversationDoc]);

  async function handleNewMessage(e) {
    e.preventDefault();
    try {
      const messageType = modalPrompt === 'Add Her Message' ? 'RECEIVED' : 'SENT';
      const message = {
        type: messageType,
        content: newMessageText,
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
    e.preventDefault();
    if (!messageHistory.length) return;

    const messages = messageHistory.map((message) => ({
      type: message.type === 'RECEIVED' ? 'user' : 'system',
      content: message.content,
    }));
    const firstMessage = `Let's play a game. Pretend that I am a 20 year old girl and you are a 20 year old boy. We are flirting on Tinder.
    Each of your messages should do one or more of the following: 1) get to know me better 2) share info about things we have in common
    Here are your rules: 1) keep your messages similar in length to mine 2) use lowercase words and chatspeak 3) no emojis 4) one question max per response
    Let's begin, here's my first message: ${messages[0].content}`;
    messages[0] = firstMessage

    try {
      const chatCompletions = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages,
        n: 5,
      })
      console.log(chatCompletions)
    } catch (err) {
      console.log(err.message)
    }
  }

  function closeModal() {
    setNewMessageText('');
    setModalPrompt(null);
  }

  return (
    <>
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

        <div className='conversation-history'>
          <RenderMessages messages={messageHistory} />
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
              <textarea value={userPrompt} onChange={(e) => setUserPrompt(e.target.value)} />
            </label>
            <button className='btn'>Generate Rizz!</button>
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
