import { useAuthContext } from './hooks/useAuthContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// pages & components
import Home from './pages/home/Home';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import Create from './pages/create/Create';

// styles
import './App.css';

function App() {
  const { authIsReady } = useAuthContext()
  
  return (
    <div className="App">
      {authIsReady && (
        <Router>
          <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="/create" element={<Create />}/>
            <Route path="/signin" element={<SignIn />}/>
            <Route path="/signup" element={<SignUp />}/>
          </Routes>
        </Router>
      )}
    </div>
  );
}

export default App;
