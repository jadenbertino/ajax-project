export default function RenderConversation({ conversationContent }) {
  return (
    <div className='content'>
      {conversationContent && conversationContent.map((message, i) => (
        <div key={i} className={message.type.toLowerCase()}>
          <p>{message.message}</p>
        </div>
      ))}
    </div>
  )
}