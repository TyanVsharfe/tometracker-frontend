import {Route, Routes, useLocation, useNavigate} from 'react-router-dom';
//import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Navigation from "./components/Navbar.tsx";
import NotFoundPage from "./pages/NotFoundPage.tsx";
import SearchPage from "./pages/Books/SearchPage.tsx";
import BookPage from "./pages/Books/BookPage.tsx";
import UserBooksPage from "./pages/User/UserBooksPage.tsx";
import LoginPage from "./pages/Auth/LoginPage.tsx";
import RegisterPage from "./pages/Auth/RegisterPage.tsx";
import {useEffect, useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import {RootState} from "./store/store.ts";
import {verifySession} from "./store/authSlice.ts";
import UserInfoPage from "./pages/User/UserInfoPage.tsx";
import UserSettingsPage from "./pages/User/UserSettingsPage.tsx";

function App() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const isLogin = useSelector((state: RootState) => state.auth.isLogin);
    const loading = useSelector((state: RootState) => state.auth.loading);
    const [isInitialCheckDone, setIsInitialCheckDone] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            // Получаем результат проверки сессии напрямую
            const isAuthenticated = await dispatch(verifySession() as any).unwrap();

            const requiresAuthPaths = ['/account/books'];
            const isAuthRequired = requiresAuthPaths.some((path) =>
                location.pathname.startsWith(path)
            );
            const isLoginPage = location.pathname === '/login';

            console.log(
                'isAuthenticated (from verifySession):', isAuthenticated,
                'isLogin (from Redux):', isLogin,
                'loading:', loading,
                'path:', location.pathname
            );

            if (!loading && !isAuthenticated && isAuthRequired && !isLoginPage) {
                navigate('/login');
            }
        };

        checkAuth();
    }, [dispatch, navigate, location.pathname]);

  return (
    <>
        <Navigation />
        <Routes>
            {/*<Route path="/" element={<HomePage />} />*/}
            <Route path="/login" element={<LoginPage/>} />
            <Route path="/registration" element={<RegisterPage/>} />
            <Route path="/account" element={<UserInfoPage />} />
            <Route path="/account/settings" element={<UserSettingsPage />} />
            <Route path="/account/books" element={<UserBooksPage />} />
            <Route path="/books/:id" element={<BookPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    </>
  )
}

export default App
