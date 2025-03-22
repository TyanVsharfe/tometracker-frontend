import { Route, Routes } from 'react-router-dom';
//import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Navigation from "./components/Navbar.tsx";
import NotFoundPage from "./pages/NotFoundPage.tsx";
import SearchPage from "./pages/SearchPage.tsx";
import BookPage from "./pages/Books/BookPage.tsx";
import UserBooksPage from "./pages/Books/UserBooksPage.tsx";
import LoginPage from "./pages/Auth/LoginPage.tsx";
import RegisterPage from "./pages/Auth/RegisterPage.tsx";

function App() {
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
            <Route path="/login" element={<LoginPage/>} />
            <Route path="/registration" element={<RegisterPage/>} />
            <Route path="account/books" element={<UserBooksPage />} />
            <Route path="/books/:id" element={<BookPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    </>
  )
}

export default App
