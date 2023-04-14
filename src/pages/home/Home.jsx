import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { useAuthContext } from "../../hooks/useAuthContext"
import { useSignOut } from '../../hooks/useSignOut'

import './Home.css'

export default function Home() {
  const { user } = useAuthContext()
  const nav = useNavigate()
  const { signout } = useSignOut()
  const [conversations, setConversations] = useState([])

  // redirect user to sign in page if not signed in
  useEffect(() => {
    if (!user) {
      nav('/signin')
    }
  }, [user, nav])

  return (
    <div className='home'>
      <div className="df vh-100 jcc aic">
        <nav>
          <button className="btn" onClick={signout}>sign out</button>
        </nav>
        <div className="container">
          <h1>Select A Conversation:</h1>
          <div className="conversations">
          {conversations.length ? 
            conversations.map((conversation, i) => (
              <div className="conversation" key={i}>
                {/* insert fetched conversations here */}
              </div>
              )): null}
            <div className="conversation">
              <i className="fa-solid fa-plus"></i>
              <p>New Conversation</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}