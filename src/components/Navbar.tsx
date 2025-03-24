import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { ReactComponent as Logout } from '../assets/logout.svg';
import "../pages/style/nav.css"

import "bootstrap-icons/font/bootstrap-icons.css";

import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import {checkSession, logoutUser} from "../services/authService.ts";
import BookControls from "./BookControls.tsx";
import {addBook} from "../services/bookService.ts";
import {addUserBook} from "../services/userBookService.ts";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../store/store.ts";
import {logout} from "../store/authSlice.ts";

const Navigation: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isLogin = useSelector((state: RootState) => state.auth.isLogin)

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    };

    const handleLogout = () => {
        dispatch(logout() as any).then(() => navigate('/login'));
    };

    return (
        <Navbar style={{width:'100%'}} data-bs-theme="dark" expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand href="/main"><h1>tometracker</h1></Navbar.Brand>
                <Navbar id="basic-navbar-nav">
                    <Nav className="container-fluid">
                        <Nav.Link className='nav__link' href="/main">Главная</Nav.Link>
                        <Nav.Link className='nav__link' href="/search">Поиск</Nav.Link>
                        {isLogin ? (
                            <Nav.Link className='nav__link' href="/account/books">Аккаунт</Nav.Link>
                        ) : (
                            <Nav.Link className='nav__link' href="/login">Войти</Nav.Link>
                        )}
                        {/*<Nav.Link href="/search"><i className="bi bi-search" style={{fontSize: '2rem'}}></i></Nav.Link>
                        <Nav.Link href="/account"><i className="bi bi-person-circle" style={{fontSize: '2rem'}}></i></Nav.Link>*/}
                        <Form onSubmit={handleSubmit}>
                            <Row>
                                <Col xs="auto">
                                    <Form.Control
                                        type="text"
                                        placeholder="поиск"
                                        className=" mr-sm-2"
                                        id={"gameNameInput"}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </Col>
                                {/*<Col xs="auto">*/}
                                {/*    <Button type="submit" id={"submitButton"}>искать</Button>*/}
                                {/*</Col>*/}
                            </Row>
                        </Form>
                        {isLogin ? (
                            <button style={{display: 'flex', justifyContent: 'center',
                                alignItems: 'center', background: 'transparent', border: 'none'}} onClick={handleLogout}><Logout/></button>
                        ) : (
                            <div style={{width: '36px', height:'26px'}}></div>
                        )}
                    </Nav>
                </Navbar>
            </Container>
        </Navbar>
    );
}

export default React.memo(Navigation);