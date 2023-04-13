import { useEffect } from "react"
import { useNavigate } from "react-router"
import { useAuthContext } from "../../hooks/useAuthContext"

// styles
import './auth.css'

export default function SignIn() {
  const { user } = useAuthContext()
  const nav = useNavigate()

  // redirect user to home page if signed in
  useEffect(() => {
    if (user) {
      nav('/')
    }
  }, [user, nav])
  return (
      <div className="container bg-dark">
        <div className="row jcc aic">
          <div className="col">
            <div className="auth-content">

            </div>
          </div>
        </div>
      </div>
  )
}