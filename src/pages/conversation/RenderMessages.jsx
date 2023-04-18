import { useEffect, useRef } from "react";

export default function RenderMessages({ conversationContent }) {
  const lastMessageRef = useRef(null)
  
  useEffect(() => {
    if (!lastMessageRef.current) return;
    lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [conversationContent])

  return (
    <div className="messages-wrapper">
      <div className='messages'>
        {conversationContent && conversationContent.map((message, i) => (
          <div 
            key={i} 
            className={`message ${message.type.toLowerCase()}`}
            ref={i === conversationContent.length - 1 ? lastMessageRef : null}
          >
            <p>{message.message}</p>
          </div>
        ))}
      </div>
    </div>
  )
}