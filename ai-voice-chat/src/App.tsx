/*import { useState } from 'react';
import Login from './components/Login';
import Chat from './components/Chat';

function App() {
  // Kezdetben 'false', tehát a Login jelenik meg
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Ideiglenes beléptető függvény (később a Firebase fogja váltani)
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {!isAuthenticated ? (
        <Login onLogin={handleLoginSuccess} />
      ) : (
        <Chat />
      )}
    </div>
  );
}

export default App;*/
import Chat from './components/Chat';

function App() {
  return (
    <div className="min-h-screen bg-slate-900">
      <Chat />
    </div>
  );
}

export default App;