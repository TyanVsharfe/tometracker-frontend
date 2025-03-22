import React, {useState} from 'react';
import Form from 'react-bootstrap/Form';
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import {loginUser, User} from "../../services/authService.ts";
import {useNavigate} from "react-router-dom";

const LoginPage: React.FC = () => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('')
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const user: User = {username: login, password: password};
        await loginUser(user)
        navigate('/account/books')
        
        // try {
        //     const user = await loginUser({ login: login, password });
        //     dispatch(login(user));
        //     localStorage.setItem('user', JSON.stringify(user));
        //     navigate('/');
        // } catch (error) {
        //     console.error('Login failed:', error);
        //     alert('Login failed. Please check your credentials.');
        // }
    };


    return (
        <Container style={{ justifyContent: 'center', width: '300px', display: 'flex', flexDirection: 'column', verticalAlign: 'top', height: '70vh' }}>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicLogin">
                    <Form.Label>Логин</Form.Label>
                    <Form.Control type="text" placeholder="Login"
                                  onChange={(e) => setLogin(e.target.value)}/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Пароль</Form.Label>
                    <Form.Control type="password" placeholder="Password"
                                  onChange={(e) => setPassword(e.target.value)}/>
                    <Form.Text className="text-muted">
                        <br/>
                        <p>Нет аккаунта? <a href="/registration">Зарегистрируйтесь</a></p>
                        <p><a href="/forgot-password">Забыли пароль?</a></p>
                    </Form.Text>
                </Form.Group>

                <Button variant="primary" type="submit">
                    Войти
                </Button>
            </Form>
        </Container>
    );
};

export default LoginPage;

