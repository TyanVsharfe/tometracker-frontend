import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import "bootstrap-icons/font/bootstrap-icons.css";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Navigation: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Предотвращаем стандартное поведение формы
        navigate(`/search?q=${encodeURIComponent(searchTerm)}`); // Перенаправляем на нужный адрес
    };

    return (
        <Navbar data-bs-theme="dark" expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand href="/main"><h1>tometracker</h1></Navbar.Brand>
                <Navbar id="basic-navbar-nav">
                    <Nav className="container-fluid">
                        <Nav.Link href="/main">Home</Nav.Link>
                        <Nav.Link href="/search">Search</Nav.Link>
                        <Nav.Link href="/account/books">Account</Nav.Link>
                        {/*<Nav.Link href="/search"><i className="bi bi-search" style={{fontSize: '2rem'}}></i></Nav.Link>
                        <Nav.Link href="/account"><i className="bi bi-person-circle" style={{fontSize: '2rem'}}></i></Nav.Link>*/}
                        <Form onSubmit={handleSubmit}>
                            <Row>
                                <Col xs="auto">
                                    <Form.Control
                                        type="text"
                                        placeholder="Search"
                                        className=" mr-sm-2"
                                        id={"gameNameInput"}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </Col>
                                <Col xs="auto">
                                    <Button type="submit" id={"submitButton"}>Submit</Button>
                                </Col>
                            </Row>
                        </Form>
                    </Nav>
                </Navbar>
            </Container>
        </Navbar>
    );
}

export default Navigation;