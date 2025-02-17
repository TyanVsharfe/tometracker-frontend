import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import "bootstrap-icons/font/bootstrap-icons.css";

import React, { useState } from 'react';

const Navigation: React.FC = () => {
    //const [isLoading, setIsLoading] = useState(false);
    //const [searchResults, setSearchResults] = useState(null);
    //const [gameName, setGameName] = useState('');

    // const handleSearchSubmit = async () => {
    //     localStorage.removeItem('game_list');
    //     //setIsLoading(true);
    //     localStorage.setItem('loading', true);
    //     const gameName = document.getElementById('gameNameInput').value;
    //     console.log("Game title - " + gameName)
    //     try {
    //         const data = await getIdgbGamesList(gameName);
    //
    //         console.log("Data " + data);
    //         //console.log("SearchResults до set " + searchResults);
    //         setSearchResults(data);
    //         localStorage.setItem('game_list', JSON.stringify(data));
    //         //console.log("SearchResults после set " + searchResults);
    //     } catch (error) {
    //         console.error('Ошибка при выполнении запроса:', error);
    //     } finally {
    //         //setIsLoading(false);
    //     }
    // };

    return (
        <Navbar data-bs-theme="dark" expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand href="/main"><h1>tometracker</h1></Navbar.Brand>
                <Navbar id="basic-navbar-nav">
                    <Nav className="container-fluid">
                        <Nav.Link href="/main">Home</Nav.Link>
                        <Nav.Link href="/search">Search</Nav.Link>
                        <Nav.Link href="/account/games">Account</Nav.Link>
                        {/*<Nav.Link href="/search"><i className="bi bi-search" style={{fontSize: '2rem'}}></i></Nav.Link>
                        <Nav.Link href="/account"><i className="bi bi-person-circle" style={{fontSize: '2rem'}}></i></Nav.Link>*/}
                        <Form onSubmit="">
                            <Row>
                                <Col xs="auto">
                                    <Form.Control
                                        type="text"
                                        placeholder="Search"
                                        className=" mr-sm-2"
                                        id={"gameNameInput"}
                                        value=""
                                        onChange=""
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