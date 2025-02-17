import { useState } from 'react'
import { Route, Routes } from 'react-router-dom';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
//import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Navigation from "./components/Navbar.tsx";
import NotFoundPage from "./pages/NotFoundPage.tsx";

function App() {
  const [count, setCount] = useState(0)

    // const user = useSelector((state: RootState) => state.auth.user); // Получаем
    // const dispatch = useDispatch();
    // useEffect(() => {
    //     const user = localStorage.getItem('user');
    //     if (user) {
    //         dispatch(login(JSON.parse(user))); // Восстанавливаем пользователя из localStorage
    //     }
    // }, [dispatch]);

  return (
    <>
        <Navigation />
        <Routes>
            {/*<Route path="/" element={<HomePage />} />*/}
            {/*<Route path="/books" element={user ? <NotesPage /> : <Navigate to="/" />} />*/}
            {/*<Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />*/}
            {/*<Route path="/register" element={user ? <Navigate to="/" /> : <RegisterPage />} />*/}
            {/*<Route path="/note/:id" element={user ? <NoteDetailPage /> : <Navigate to="/" />} />*/}
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    </>
  )
}

export default App
