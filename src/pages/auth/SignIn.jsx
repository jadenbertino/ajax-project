import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuthContext } from "../../hooks/useAuthContext";

// styles
import "./auth.css";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user } = useAuthContext();
  const nav = useNavigate();

  // redirect user to home page if signed in
  useEffect(() => {
    if (user) {
      nav("/");
    }
  }, [user, nav]);
  
  return (
    <div className="container">
      <div className="row jcc aic">
        <div className="col">
          <form className="auth">
            <h2 className="header">welcome back</h2>
            <input
              type="email"
              value={email}
              placeholder="email"
              onChange={e => setEmail(e.target.value)}
              />
            <input
              type="password"
              placeholder="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <button className="btn">Sign In</button>
          </form>
        </div>
      </div>
    </div>
  );
}
