import { useEffect } from "react"
import { useNavigate } from "react-router"
import { useAuthContext } from "../../hooks/useAuthContext"

export default function Home() {
  const { user } = useAuthContext()
  const nav = useNavigate()

  // redirect user to sign in page if not signed in
  useEffect(() => {
    if (!user) {
      nav('/signin')
    }
  }, [user, nav])

  return (
    <div className='home'>
      Home
    </div>
  )
}