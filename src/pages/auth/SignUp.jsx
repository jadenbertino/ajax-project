import { useEffect } from "react"
import { useNavigate } from "react-router"
import { useAuthContext } from "../../hooks/useAuthContext"

// styles
import './auth.css'

export default function SignUp() {
  const { user } = useAuthContext()
  const nav = useNavigate()

  // redirect user to home page signed in
  useEffect(() => {
    if (user) {
      nav('/')
    }
  }, [user, nav])

  return (
    <div className='auth'>
      
    </div>
  )
}