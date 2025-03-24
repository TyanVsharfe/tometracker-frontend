import React, {useEffect, useState} from "react";
import Container from "react-bootstrap/Container";
import {Alert, Stack} from "react-bootstrap";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import {getBooks} from "../../services/userBookService.ts";

import "../style/style.css"
import "../style/book-card.css"
import {Book} from "../../services/bookService.ts";

function UserBooksPage() {
    const [userBooks, setUserBooks] = useState([]);
    const [filterStatus, setFilterStatus] = useState("");
    const [activeFilterButtonIndex, setActiveFilterButton] = useState(0);


    useEffect(() => {
        handleUserBooks()
    }, [filterStatus]);

    const handleUserBooks = () => {
        try {
            getBooks(filterStatus).then(results => {
                //localStorage.setItem('book_list', JSON.stringify(results));
                console.log(results);
                setUserBooks(results)
            });

            localStorage.setItem('user_books_list', JSON.stringify(userBooks));
        } catch (error) {
            console.error('Error when executing the request:', error);
        }
    };

    const renderUserBooks = () => {
        const booksResults = userBooks;

        // const gameList = localStorage.getItem('game_list');
        //
        // if (gameList === null) {
        //     console.log('localStorage is empty');
        // } else {
        //     // localStorage не пуст, удаляем game_list
        //     localStorage.removeItem('game_list');
        //     console.log('game_list removed');
        // }

        console.log("Ниже вывод " + JSON.stringify(booksResults));
        console.log("Это массив? " + Array.isArray(booksResults));

        if (Array.isArray(booksResults)) {
            return (
                <Container className="justify-content-start align-items-center books-list">
                    {
                        booksResults.map((book: Book, index: number) => (
                            <Col key={index} style={{paddingBottom: '20px', flex: '0 1 calc(20% - 10px)'}}>
                                <Card data-bs-theme='dark' style={{ width: '9rem'}}  className='text-center' border='light'>
                                    <Card.Img className='book__cover' variant="top" src={book?.coverUrl || ''}/>
                                    <Card.Body className='book__body'>
                                        <Container style={{height:'60px'}}>
                                            <Card.Title className="book__title">
                                                {book.title}
                                            </Card.Title>
                                        </Container>
                                        <Card.Text>
                                            <Container>
                                                {/*{book.platforms && (*/}
                                                {/*    book.platforms.map((platform) => `${platform.abbreviation?.replace(' ', '-') || ''} `)*/}
                                                {/*)}*/}
                                            </Container>
                                        </Card.Text>
                                        <Button style={{ width: '90%', fontSize: '12px'}} variant='primary' href={`/books/${book.gbId}`}>Подробнее</Button>
                                    </Card.Body>
                                    <Card.Footer className='text-muted'>
                                        {/*{book.first_release_date*/}
                                        {/*    ? new Date(book.first_release_date * 1000).toLocaleDateString()*/}
                                        {/*    : book.release_dates && book.release_dates[0].y}*/}
                                    </Card.Footer>
                                </Card>
                            </Col>)
                        )}
                </Container>
            )
        }
        else {
            return (
                <Container style={{textAlign: "center", maxWidth: "500px"}}>
                    <Alert>Books not found</Alert>
                </Container>
            )
        }
    };

    return (
        <Container style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
            <Nav variant="tabs" className="justify-content-center" defaultActiveKey="" style={{width: "50%"}}>
                <Nav.Item>
                    <Nav.Link href="">Информация о аккаунте</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link href="">Мои книги</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link href="">Настройки</Nav.Link>
                </Nav.Item>
            </Nav>

            <Container>
                <Stack className=".d-flex justify-content-center align-items-center">
                    <h1 className='page-title'>Мои книги</h1>
                    <Stack direction="horizontal" className=".d-flex justify-content-md-center align-items-center" gap={4}>
                        <Button variant="outline-primary" disabled={activeFilterButtonIndex === 0} onClick={() => {
                            setActiveFilterButton(0)
                            setFilterStatus("")
                        }}>Все книги</Button>
                        <Button variant="outline-primary" disabled={activeFilterButtonIndex === 1} onClick={() => {
                            setActiveFilterButton(1)
                            setFilterStatus("Completed")
                        }}>Прочитано</Button>
                        <Button variant="outline-primary" disabled={activeFilterButtonIndex === 2} onClick={() => {
                            setActiveFilterButton(2)
                            setFilterStatus("Playing")
                        }}>Читаю</Button>
                        <Button variant="outline-primary" disabled={activeFilterButtonIndex === 3} onClick={() => {
                            setActiveFilterButton(3)
                            setFilterStatus("Planned")
                        }}>В планах</Button>
                        <Button variant="outline-primary" disabled={activeFilterButtonIndex === 4} onClick={() => {
                            setActiveFilterButton(4)
                            setFilterStatus("Abandoned")
                        }}>Заброшено</Button>
                        <Button variant="outline-primary" disabled={activeFilterButtonIndex === 5} onClick={() => {
                            setActiveFilterButton(5)
                            setFilterStatus("None")
                        }}>Без статуса</Button>
                    </Stack>
                </Stack>
                <br/>
                {/*<Container className="justify-content-center align-items-center games-list">*/}
                {/*    <UserGames userGames={userGames}/>*/}
                {/*</Container>*/}
                {renderUserBooks()}
            </Container>
        </Container>
    );
}

export default UserBooksPage;