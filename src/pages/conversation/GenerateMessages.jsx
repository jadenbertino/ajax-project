import { useState } from 'react';
import Modal from '../../components/Modal';
import { useWindowSize } from '../../hooks/useWindowSize';
import RenderChatCompletions from './RenderChatCompletions';

const OPEN_AI_API_KEY = process.env.REACT_APP_OPEN_AI_API_KEY;

export default function GenerateMessages({ messageHistory, modalActive, setModalActive }) {
  const [loadingChatCompletions, setLoadingChatCompletions] = useState(false);
  const [chatCompletions, setChatCompletions] = useState([]);
  const { width: windowWidth } = useWindowSize();

  async function generateFiveNewMessages() {
    if (!messageHistory.length) return;
    setChatCompletions([]);
    setLoadingChatCompletions(true);
    if (isMobileScreenSize()) setModalActive('CHAT_COMPLETIONS');

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
      const { messageChoices } = await getChatCompletion(PARAMS);
      setChatCompletions(messageChoices);
      setLoadingChatCompletions(false);
    } catch (err) {
      console.log(err.message);
      setLoadingChatCompletions(false);
    }
  }

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
    const messageChoices = data.choices.map((messageObj) => messageObj.message.content);
    const tokensUsed = data.usage.total_tokens;
    return { messageChoices, tokensUsed };
  }

  // Helper Functions
  function closeModal() {
    setModalActive('');
  }

  function isMobileScreenSize() {
    return windowWidth <= 768;
  }

  return (
    <div className='generate-message'>
      <div className='view-or-generate-rizz-btns'>
        {isMobileScreenSize() && (loadingChatCompletions || chatCompletions.length) ? (
          <button className='btn' onClick={() => setModalActive('CHAT_COMPLETIONS')}>
            View Rizz
          </button>
        ) : null}
        <button className='btn generate-rizz-btn' onClick={generateFiveNewMessages}>
          Generate Rizz!
        </button>
      </div>
      {loadingChatCompletions || chatCompletions.length ? (
        !isMobileScreenSize() ? (
          <RenderChatCompletions chatCompletions={chatCompletions} />
        ) : modalActive === 'CHAT_COMPLETIONS' ? (
          <Modal closeModal={closeModal}>
            <RenderChatCompletions chatCompletions={chatCompletions} />
            <div className="btn close-chat-completions" onClick={closeModal}>Close</div>
          </Modal>
        ) : null
      ) : null}
    </div>
  );
}
