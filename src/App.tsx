import { useState, useEffect } from 'react';
import './App.css';
import Login from './components/Login';
import Todos from './components/Todos';
import { fetchTodos, addTodo, deleteTodo, updateTodo, TodoUpdate } from './components/Api';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Button from '@mui/material/Button';
import { GoogleOAuthProvider, googleLogout } from '@react-oauth/google';
import AddTodo from './components/AddTodo';

function App() {
  const [todos, setTodos] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [jwtToken, setJwtToken] = useState<string | null>(null);
  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(5);
  const [prevPage, setPrevPage] = useState<number | null>(null);

  const handleLoginSuccess = async (token: string) => {
    setJwtToken(token);
    try {
      await handlePageChange(currentPage);
    } catch (err) {
      setError('Error fetching todos');
    }
  };

  const handleLogout = () => {
    googleLogout();
    setJwtToken(null);
    setTodos([]);
    setError(null);
    setCurrentPage(1);
    setTotalPages(0);
    setPrevPage(null);
  };

  const handleAddTodo = async (newTodo: TodoUpdate) => {
    if (!jwtToken) return;

    console.log("app.tsx içinde : " + newTodo.dueDate);
    try {
      await addTodo(jwtToken, newTodo);

      const todosData = await fetchTodos(jwtToken, currentPage, pageSize);
      setTodos(todosData.data);
      setTotalPages(todosData.totalPages);

      if (todosData.data.length === 0 && currentPage < todosData.totalPages) {
        setCurrentPage(currentPage + 1);
      }

      setIsAddingTodo(false);
    } catch (err) {
      setError('Error adding todo');
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    if (!jwtToken) return;

    try {
      await deleteTodo(jwtToken, todoId);

      const todosData = await fetchTodos(jwtToken, currentPage, pageSize);
      setTodos(todosData.data);
      setTotalPages(todosData.totalPages);

      if (todosData.data.length === 0) {
        if (currentPage < todosData.totalPages) {
          setCurrentPage(currentPage + 1);
        }
        else {
          setCurrentPage(1);
        }
      }
    } catch (err) {
      setError('Error deleting todo');
    }
  }

  const handleUpdateTodo = async (todoId: number, newTodo: TodoUpdate) => {
    if (!jwtToken) return;

    try {
      await updateTodo(jwtToken, todoId, newTodo);

      const todosData = await fetchTodos(jwtToken, currentPage, pageSize);
      setTodos(todosData.data);
      setTotalPages(todosData.totalPages);

      if (todosData.data.length === 0) {
        if (currentPage < todosData.totalPages) {
          setCurrentPage(currentPage + 1);
        }
        else {
          setCurrentPage(1);
        }
      }
    } catch (err) {
      setError('Error updating todo');
    }
  }

  const handlePageChange = async (page: number) => {
    if (!jwtToken || page === prevPage) return;
    try {
      const todosData = await fetchTodos(jwtToken, page, pageSize);
      setTodos(todosData.data);
      setCurrentPage(page);
      setTotalPages(todosData.totalPages);
      setPrevPage(page);
    } catch (err) {
      setError('Error fetching todos');
    }
  };

  useEffect(() => {
    if (jwtToken && currentPage !== prevPage) {
      handlePageChange(currentPage);
    }
  }, [currentPage, jwtToken, prevPage]);

  return (
    <GoogleOAuthProvider clientId="402020546066-5a17dkenlt3dmd33v92qs6273it35e39.apps.googleusercontent.com">
      <div>
        <AppBar position="static" color="primary">
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Schedify
            </Typography>
            {!jwtToken ? (
              <Login onLoginSuccess={handleLoginSuccess} />
            ) : (
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            )}
          </Toolbar>
        </AppBar>
      </div>

      <div>
        {!jwtToken ? (
          <Typography variant="h6" component="div" align="center" sx={{ mt: 4 }}>
            Please login to see your todos.
          </Typography>
        ) : error ? (
          <Typography variant="h6" component="div" align="center" sx={{ mt: 4 }}>
            {error}
          </Typography>
        ) : isAddingTodo ? (
          <AddTodo onAddTodo={handleAddTodo} onCancel={() => setIsAddingTodo(false)} />
        ) : (
          <>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setIsAddingTodo(true)}
              style={{ margin: '20px' }}
            >
              Add New Todo
            </Button>
            <Todos
              todos={todos}
              error={error}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              onDeleteTodo={handleDeleteTodo}
              onUpdateTodo={handleUpdateTodo}
            />
          </>
        )}
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;
