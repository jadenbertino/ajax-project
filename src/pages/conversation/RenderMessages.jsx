import { useEffect, useRef } from "react";

export default function RenderMessages({ messages }) {
  const lastMessageRef = useRef(null)
  
  useEffect(() => {
    if (!lastMessageRef.current) return;
    lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages])

  return (
    <div className="messages-wrapper">
      <div className='messages'>
        {messages && messages.map((message, i) => (
          <div 
            key={i} 
            className={`message ${message.type.toLowerCase()}`}
            ref={i === messages.length - 1 ? lastMessageRef : null}
          >
            <p>{message.textContent}</p>
          </div>
        ))}
      </div>
    </div>
  )
}