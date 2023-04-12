import { useAuthContext } from './hooks/useAuthContext';

import './App.css';

function App() {
  const { authIsReady } = useAuthContext()
  
  return (
    <div className="App">
      {authIsReady && (
        <div>READY</div>
      )}
    </div>
  );
}

export default App;
