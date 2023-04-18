import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';

// pages & components
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import Conversation from './pages/conversation/Conversation';
import Create from './pages/create/Create';
import Home from './pages/home/Home';

// styles
import './App.css';

function App() {
  const { authIsReady } = useAuthContext();

  return (
    <div className='App'>
      {authIsReady && (
        <Router>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/create' element={<Create />} />
            <Route path='/signin' element={<SignIn />} />
            <Route path='/signup' element={<SignUp />} />
            <Route
              path='/conversations/:conversationID'
              element={<Conversation />}
            />
          </Routes>
        </Router>
      )}
    </div>
  );
}

export default App;
