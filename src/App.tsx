import { useState, useEffect } from 'react';
import './App.css';
import Login from './components/Login';
import Todos from './components/Todos';
import { fetchTodos, addTodo } from './api/api';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Button from '@mui/material/Button';
import { GoogleOAuthProvider, googleLogout } from '@react-oauth/google';
import AddTodo from './components/AddTodo'; // Yeni ekleme ekranı

function App() {
  const [todos, setTodos] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [jwtToken, setJwtToken] = useState<string | null>(null);
  const [isAddingTodo, setIsAddingTodo] = useState(false); // Yeni Todo ekleme ekranını kontrol etmek için
  const [currentPage, setCurrentPage] = useState(1); // Mevcut sayfa
  const [totalPages, setTotalPages] = useState(0); // Toplam sayfa sayısı
  const [pageSize] = useState(5); // Sayfa başına öğe sayısı
  const [prevPage, setPrevPage] = useState<number | null>(null); // Önceki sayfa numarasını tutacağız

  const handleLoginSuccess = async (token: string) => {
    setJwtToken(token);
    try {
      await handlePageChange(currentPage); // Sayfa yüklerken verileri çek
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
    setPrevPage(null); // Logout sırasında önceki sayfa bilgisini sıfırla
  };

  const handleAddTodo = async (newTodo: any) => {
    if (!jwtToken) return;
    try {
      // Yeni Todo'yu ekle
      await addTodo(jwtToken, newTodo);

      // Todo eklendikten sonra verileri güncelle
      // Sayfa sayısının doğru şekilde güncellenmesini sağla
      const todosData = await fetchTodos(jwtToken, currentPage, pageSize);
      setTodos(todosData.data);  // Yeni verileri set et
      setTotalPages(todosData.totalPages);  // Toplam sayfa sayısını güncelle

      // Eğer yeni bir sayfaya geçiş gerekiyorsa (son sayfadaysak) sayfa numarasını artır
      if (todosData.data.length === 0 && currentPage < todosData.totalPages) {
        setCurrentPage(currentPage + 1);
      }

      setIsAddingTodo(false); // Todo eklendikten sonra ekleme ekranından çık
    } catch (err) {
      setError('Error adding todo');
    }
  };

  // Sayfa değiştirme işlemi
  const handlePageChange = async (page: number) => {
    if (!jwtToken || page === prevPage) return; // Aynı sayfaya gitme durumu engelleniyor
    try {
      const todosData = await fetchTodos(jwtToken, page, pageSize);
      setTodos(todosData.data);  // Update todos
      setCurrentPage(page);      // Update current page
      setTotalPages(todosData.totalPages); // Update total pages
      setPrevPage(page); // Sayfa değiştiğinde önceki sayfa bilgisini güncelle
    } catch (err) {
      setError('Error fetching todos');
    }
  };

  useEffect(() => {
    // Sayfa numarası değiştiğinde verileri çek
    if (jwtToken && currentPage !== prevPage) {
      handlePageChange(currentPage); // currentPage değiştiğinde veriyi al
    }
  }, [currentPage, jwtToken, prevPage]); // currentPage değiştiğinde tetiklenecek

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
        ) : isAddingTodo ? ( // Yeni Todo ekleme ekranını göster
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
              onPageChange={handlePageChange} // Sayfa değişim fonksiyonunu geçiyoruz
            />
          </>
        )}
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;
