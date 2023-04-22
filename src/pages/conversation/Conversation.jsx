import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuthContext';

// firestore
import { Timestamp, collection, doc, getDoc, setDoc } from '@firebase/firestore';
import { db } from '../../firebase/init';
import { useSubdocument } from '../../hooks/useSubdocument';

// components
import Modal from '../../components/Modal';
import { useWindowSize } from '../../hooks/useWindowSize';
import RenderChatCompletions from './RenderChatCompletions';
import RenderMessages from './RenderMessages';

// styles
import './Conversation.css';

const OPEN_AI_API_KEY = process.env.REACT_APP_OPEN_AI_API_KEY;

const EXAMPLE_MESSAGES = [
  'same tbh, but im hoping that talking with u will make it more interesting :) what kind of music are u into?',
  'same tbh, been trying to find some good netflix shows to watch. got any recommendations?',
  'same tbh. wyd on here just lookin for fun or are you tryna find something more serious?',
  'sameee, just been chillin at home. what kind of music are you into?',
  'same tbh, been binge-watching netflix all day lol. what kinda shows do u like to watch?',
];

/*
  data = response object
  data.usage.total_tokens
  data.choices.map(messageObj => messageObj.message.content)
*/

async function getChatCompletion(params = {}) {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + String(OPEN_AI_API_KEY),
    },
    body: JSON.stringify(params),
  };
  const response = await fetch('https://api.openai.com/v1/chat/completions', requestOptions);
  const data = await response.json();
  const messageOptions = data.choices.map((messageObj) => messageObj.message.content);
  return messageOptions;
}

export default function Conversation() {
  const { user } = useAuthContext();
  const nav = useNavigate();
  const [modalPrompt, setModalPrompt] = useState(null);
  const [newMessageText, setNewMessageText] = useState('');
  const [loadingChatCompletions, setLoadingChatCompletions] = useState(false);
  // const [chatCompletions, setChatCompletions] = useState([]);
  const [chatCompletions, setChatCompletions] = useState(EXAMPLE_MESSAGES);
  const [chatCompletionsModalActive, setChatCompletionsModalActive] = useState(false);
  const { width: windowWidth } = useWindowSize();

  // fetch conversation
  const { conversationID } = useParams();
  const [conversationsRef, setConversationsRef] = useState(null);
  const { document: conversationDoc } = useSubdocument(conversationsRef, conversationID);
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
    setConversationsRef(conversationsRef);
  }, [user, nav]);

  useEffect(() => {
    if (!conversationDoc) return;
    const { profilePhotoSrc, name, messages } = conversationDoc;
    setProfilePhotoSrc(profilePhotoSrc || '/avatar.jpg');
    setConversationName(name);
    setMessageHistory(messages);
  }, [conversationDoc]);

  async function addMessageToFirestore(e) {
    e.preventDefault();
    try {
      const messageType = modalPrompt === 'Add Her Message' ? 'RECEIVED' : 'SENT';
      const message = {
        type: messageType,
        content: newMessageText,
        timestamp: Timestamp.now(),
      };

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

  function isMobileScreenSize() {
    return windowWidth <= 768;
  }

  async function generateFiveNewMessages() {
    if (!messageHistory.length) return;
    setChatCompletions([]);
    setLoadingChatCompletions(true);
    if (isMobileScreenSize()) setChatCompletionsModalActive(true);

    const messages = messageHistory.map((message) => ({
      role: message.type === 'RECEIVED' ? 'user' : 'system',
      content: message.content,
    }));
    const firstMessage = `Let's play a game. Pretend that I am a 20 year old girl and you are a 20 year old boy. We are flirting on Tinder.
    Each of your messages should do one or more of the following: 1) get to know me better 2) share info about things we have in common
    Here are your rules: 1) keep your messages similar in length to mine 2) use lowercase words and chatspeak 3) no emojis 4) one question max per response
    Let's begin, here's my first message: ${messages[0].content}`;
    messages[0].content = firstMessage;

    try {
      const PARAMS = {
        model: 'gpt-3.5-turbo',
        messages,
        n: 5,
      };
      const chatCompletions = await getChatCompletion(PARAMS);
      setChatCompletions(chatCompletions);
      setLoadingChatCompletions(false);
    } catch (err) {
      console.log(err.message);
      setLoadingChatCompletions(false);
    }
  }

  function closeModal() {
    setNewMessageText('');
    setModalPrompt(null);
  }

  function closeChatCompletionsModal() {
    setChatCompletionsModalActive(false)
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
        <main>
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
            <div className='view-or-generate-btns'>
              {isMobileScreenSize() && (loadingChatCompletions || chatCompletions.length) ? (
                <button className='btn' onClick={() => setChatCompletionsModalActive(true)}>
                  View Rizz
                </button>
              ) : null}
              <button className='btn generate-rizz-btn' onClick={generateFiveNewMessages}>
                Generate Rizz!
              </button>
            </div>
            {loadingChatCompletions || chatCompletions.length ? 
              !isMobileScreenSize() ? (
                <RenderChatCompletions chatCompletions={chatCompletions} />
              ) : chatCompletionsModalActive ? (
                <Modal closeModal={closeChatCompletionsModal}>
                  <i className="fa-solid fa-x close-modal-icon" onClick={closeChatCompletionsModal}></i>
                  <RenderChatCompletions chatCompletions={chatCompletions} />
                </Modal>
              ) : null : null}
          </div>
        </main>
      </div>

      {modalPrompt && (
        <Modal closeModal={closeModal}>
          <form
            onSubmit={addMessageToFirestore}
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
