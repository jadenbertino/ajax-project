import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useSignUp } from '../../hooks/useSignUp';

// styles
import './auth.css';

export default function SignIn() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { user } = useAuthContext();
  const nav = useNavigate();
  const { signup, error } = useSignUp();

  // redirect user to home page if signed in
  useEffect(() => {
    if (user) nav('/');
  }, [user, nav]);

  async function handleSubmit(e) {
    e.preventDefault();
    await signup(username, email, password);
  }

  return (
    <div className='fullscreen dfa'>
      <div className='container dfa'>
        <form className='auth-prompt' onSubmit={handleSubmit}>
          <h2 className='header'>claim your rizz robot 👇</h2>
          <label>
            <span>Username</span>
            <input
              required
              type='text'
              value={username}
              placeholder='john143'
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          <label>
            <span>Email</span>
            <input
              required
              type='email'
              value={email}
              placeholder='john@gmail.com'
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label>
            <span>Password</span>
            <input
              required
              type='password'
              placeholder='6+ characters'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          {error && <div className='error'>{error}</div>}
          <button className='btn'>sign up</button>
          <span>
            have an account already?&nbsp;
            <Link className='redirect' to='/signin'>
              sign in here
            </Link>
          </span>
        </form>
      </div>
    </div>
  );
}
