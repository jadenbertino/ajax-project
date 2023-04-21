import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuthContext';

// firestore
import { Timestamp, collection, doc, getDoc, setDoc, setIndexConfiguration } from '@firebase/firestore';
import { db } from '../../firebase/init';
import { useSubdocument } from '../../hooks/useSubdocument';

// components
import Modal from '../../components/Modal';
import RenderMessages from './RenderMessages';

// styles
import './Conversation.css';
import './LoadingRing.css';
import clipboardIcon from './clipboardIcon.png';
import checkmarkIcon from './checkmarkIcon.png'

const OPEN_AI_API_KEY = process.env.REACT_APP_OPEN_AI_API_KEY;

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

  // fetch conversation
  const { conversationID } = useParams();
  const [conversationsRef, setConversationsRef] = useState(null);
  const { document: conversationDoc } = useSubdocument(conversationsRef, conversationID);
  const [conversationName, setConversationName] = useState('');
  const [profilePhotoSrc, setProfilePhotoSrc] = useState('/avatar.jpg');
  const [messageHistory, setMessageHistory] = useState([]);
  const [userPrompt, setUserPrompt] = useState('');
  const [chatCompletions, setChatCompletions] = useState([
    'same tbh, but im hoping that talking with u will make it more interesting :) what kind of music are u into?',
    'same tbh, been trying to find some good netflix shows to watch. got any recommendations?',
    'same tbh. wyd on here just lookin for fun or are you tryna find something more serious?',
    'sameee, just been chillin at home. what kind of music are you into?',
    'same tbh, been binge-watching netflix all day lol. what kinda shows do u like to watch?',
  ]);
  const [loadingChatCompletions, setLoadingChatCompletions] = useState(false);
  const [copyIconSrcs, setCopyIconSrcs] = useState([])

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

  useEffect(() => {
    setCopyIconSrcs(chatCompletions.map(() => clipboardIcon))
  }, [chatCompletions])

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
    setLoadingChatCompletions(true);

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

  function handleCopy(e, index) {
    e.preventDefault();

    const textToCopy = e.target.nextElementSibling.textContent;
    navigator.clipboard.writeText(textToCopy);
    setIconToCheckmarkForOneSecond(index)
  }

  function setIconToCheckmarkForOneSecond(index) {
    setCopyIconSrcs((prevSrcs) => {
      const newSrcs = [...prevSrcs];
      newSrcs[index] = checkmarkIcon;
      return newSrcs;
    });
    setTimeout(() => {
      setCopyIconSrcs((prevSrcs) => {
        const newSrcs = [...prevSrcs];
        newSrcs[index] = clipboardIcon;
        return newSrcs;
      });
    }, 1000);
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
          {loadingChatCompletions && (
            <div className='completions'>
              <h2 className='header'>Loading Rizz. . .</h2>
              <div className='dfa'>
                <div class='loading-ring'>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </div>
            </div>
          )}
          {chatCompletions.length && chatCompletions.length === copyIconSrcs.length ? (
            <div className='completions'>
              <h2 className='header'>Rizz Generated!</h2>
              <ul>
                {chatCompletions.map((message, index) => (
                  <li key={index}>
                    <img
                      src={copyIconSrcs[index]}
                      className='clipboard-icon'
                      onClick={(e) => handleCopy(e, index)}
                      alt=''
                    />
                    <p>{message}</p>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
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

/*
example messages
  [
    "same tbh, but im hoping that talking with u will make it more interesting :) what kind of music are u into?",
    "same tbh, been trying to find some good netflix shows to watch. got any recommendations?",
    "same tbh. wyd on here just lookin for fun or are you tryna find something more serious?",
    "sameee, just been chillin at home. what kind of music are you into?",
    "same tbh, been binge-watching netflix all day lol. what kinda shows do u like to watch?",
  ]
  




response object:
data.usage.total_tokens
data.choices.map(messageObj => messageObj.message.content)
{
    "id": "chatcmpl-77cYUvhCo9oaed052pLSQDTSH7eOh",
    "object": "chat.completion",
    "created": 1682050858,
    "model": "gpt-3.5-turbo-0301",
    "usage": {
        "prompt_tokens": 156,
        "completion_tokens": 82,
        "total_tokens": 238
    },
    "choices": [
        {
            "message": {
                "role": "assistant",
                "content": "same haha, what do you like to do for fun?"
            },
            "finish_reason": "stop",
            "index": 0
        },
        {
            "message": {
                "role": "assistant",
                "content": "same here, just trying to find someone interesting to talk to on here. what are you studying in college?"
            },
            "finish_reason": "stop",
            "index": 1
        },
        {
            "message": {
                "role": "assistant",
                "content": "same here, just been loungin' around all day. what do you like to do for fun?"
            },
            "finish_reason": "stop",
            "index": 2
        },
        {
            "message": {
                "role": "assistant",
                "content": "same tbh lol, wut do u like to do for fun?"
            },
            "finish_reason": "stop",
            "index": 3
        },
        {
            "message": {
                "role": "assistant",
                "content": "same here lol. what do you usually do for fun?"
            },
            "finish_reason": "stop",
            "index": 4
        }
    ]
}

*/
