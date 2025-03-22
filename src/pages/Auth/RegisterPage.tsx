import React, {useState} from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {registerUser, User} from "../../services/authService.ts";
import Container from "react-bootstrap/Container";
import {useNavigate} from "react-router-dom";

const RegisterPage: React.FC = () => {
    const [login, setLogin] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const user: User = {username: login, password: password};
        await registerUser(user)
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
                    {/*<Form.Text className="text-muted">*/}
                    {/*    We'll never share your email with anyone else.*/}
                    {/*</Form.Text>*/}
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Адрес электронной почты</Form.Label>
                    <Form.Control type="email" placeholder="name@example.com"
                                  onChange={(e) => setEmail(e.target.value)}/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Пароль</Form.Label>
                    <Form.Control type="password" placeholder="Password"
                                  onChange={(e) => setPassword(e.target.value)}/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                    <Form.Check type="checkbox" label="Согласен с условиями" />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Зарегистрироваться
                </Button>
            </Form>
        </Container>
    );
};

export default RegisterPage;