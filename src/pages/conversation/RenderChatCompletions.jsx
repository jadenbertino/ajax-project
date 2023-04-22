import { useEffect, useState } from "react";
import checkmarkIcon from '../../assets/checkmarkIcon.png';
import clipboardIcon from '../../assets/clipboardIcon.png';

export default function RenderChatCompletions({ chatCompletions }) {
  const [copyIconSrcs, setCopyIconSrcs] = useState([]);

  useEffect(() => {
    setCopyIconSrcs(chatCompletions.map(() => clipboardIcon));
  }, [chatCompletions]);

  function handleCopy(e, index) {
    const textToCopy = e.target.nextElementSibling.textContent;
    navigator.clipboard.writeText(textToCopy);
    setIconToCheckmarkForOneSecond(index);
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

  if (!chatCompletions.length === copyIconSrcs.length) return;

  return (
    <div className='completions'>
      <h2 className='header'>{chatCompletions.length ? 'Rizz Generated!' : 'Loading Rizz. . .'}</h2>
      {chatCompletions.length ? (
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
      ) : (
        <div className='dfa'>
          <div className='loading-ring'>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      )}
    </div>
  );
}
