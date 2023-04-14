import { useEffect } from "react"
import { useNavigate } from "react-router"
import { useAuthContext } from "../../hooks/useAuthContext"
import { useSignOut } from '../../hooks/useSignOut'

import './Home.css'

export default function Home() {
  const { user } = useAuthContext()
  const nav = useNavigate()
  const { signout } = useSignOut()

  // redirect user to sign in page if not signed in
  useEffect(() => {
    if (!user) {
      nav('/signin')
    }
  }, [user, nav])

  return (
    <div className='home'>
      <div className="container vh-100 jc aic">
        <nav>
          <button className="btn" onClick={signout}>sign out</button>
        </nav>
      </div>
    </div>
  )
}