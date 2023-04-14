import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { useAuthContext } from "../../hooks/useAuthContext"
import { useSignOut } from '../../hooks/useSignOut'
import { Link } from "react-router-dom"

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
      <div className="fullscreen dfa">
        <nav>
          <button className="btn signout" onClick={signout}>sign out</button>
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
            <Link className="conversation" to="/create">
              <i className="fa-solid fa-plus"></i>
              <p>New Conversation</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}