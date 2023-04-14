import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useSignIn } from "../../hooks/useSignIn";

// styles
import "./auth.css";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user } = useAuthContext();
  const nav = useNavigate();
  const { signin, error } = useSignIn();

  // redirect user to home page if signed in
  useEffect(() => {
    if (user) {
      nav("/");
    }
  }, [user, nav]);

  function handleSubmit(e) {
    e.preventDefault();
    signin(email, password);
  }

  return (
    <div className="df jcc aic vh-100">
      <form className="auth" onSubmit={handleSubmit}>
        <h2 className="header">welcome back &nbsp;:&nbsp;&#41;</h2>
        <input
          required
          type="email"
          value={email}
          placeholder="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          required
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <div className="error">{error}</div>}
        <button className="btn">sign in</button>
        <span>
          don't have an account yet?&nbsp;
          <Link className="redirect" to="/signup">
            sign up here
          </Link>
        </span>
      </form>
    </div>
  );
}
