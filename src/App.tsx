import { useState } from 'react';
import './App.css';
import Login from './components/Login';
import { GoogleOAuthProvider } from '@react-oauth/google';
import axios from 'axios';

interface Todo {
  id: number;
  title: string;
  description: string;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [jwtToken, setJwtToken] = useState<string | null>(null);

  const fetchTodos = async (token: string) => {
    try {
      const response = await axios.get('https://localhost:7128/api/todos', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && Array.isArray(response.data.data)) {
        setTodos(response.data.data);
      } else {
        setError('No todos found');
      }
      //console.log(response.data);
    } catch (err) {
      setError('Error fetching todos');
      console.error(err);
    }
  };

  const handleLoginSuccess = (token: string) => {
    setJwtToken(token);
    fetchTodos(token);
    //console.log('Google login success:', token);
  };

  return (
    <GoogleOAuthProvider clientId="402020546066-5a17dkenlt3dmd33v92qs6273it35e39.apps.googleusercontent.com">
      <div>
        {!jwtToken ? (
          <Login onLoginSuccess={handleLoginSuccess} />
        ) : (
          <div>
            <h1>Todos</h1>
            {error && <p>{error}</p>}
            <ul>
              {todos.length > 0 ? (
                todos.map((todo) => (
                  <li key={todo.id}>
                    {todo.title} - {todo.description}
                  </li>
                ))
              ) : (
                <p>No todos available</p>
              )}
            </ul>
          </div>
        )}
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;
