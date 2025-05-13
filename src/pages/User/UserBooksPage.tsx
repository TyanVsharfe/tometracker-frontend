import React, {useEffect, useState} from "react";
import Container from "react-bootstrap/Container";
import {Alert, Stack} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from 'react-bootstrap/Form';
import {
    getAllBooksAuthors,
    getAllBooksGenres,
    getBooks,
} from "../../services/userBookService.ts";

import "../style/style.css"
import "../style/book-card.css"
import "../style/modal.css"
import {Book} from "../../services/userBookService.ts";
import Title from "../../components/Title.tsx";
import AccountNav from "../../components/AccountNav.tsx";
import Modal from "react-bootstrap/Modal";
import BookList from "../../components/BookList.tsx";

function UserBooksPage() {
    const [userBooks, setUserBooks] = useState<Book[]>([]);
    const [displayedBooks, setDisplayedBooks] = useState<Book[]>([]);

    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
    const [filterStatus, setFilterStatus] = useState("");
    const [activeFilterButtonIndex, setActiveFilterButton] = useState(0);

    const [genres, setGenres] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [filter, setFilter] = useState("");
    const [show, setShow] = useState(false);
    const [showAuthors, setShowAuthors] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleCloseAuthors = () => setShowAuthors(false);
    const handleShowAuthors = () => setShowAuthors(true);

    useEffect(() => {
        handleUserBooks();
        getAllBooksGenres().then(data => {
            setGenres(data)
        });
        getAllBooksAuthors().then(data => {
            console.log(data)
            setAuthors(data)
        });
    }, [filterStatus]);

    const handleGenreChange = (genre: string) => {
        setSelectedGenres(prev =>
            prev.includes(genre)
                ? prev.filter(g => g !== genre)
                : [...prev, genre]
        );
    };

    const handleAuthorChange = (author: string) => {
        setSelectedAuthors(prev =>
            prev.includes(author)
                ? prev.filter(g => g !== author)
                : [...prev, author]
        );
    };

    const handleUserBooks = () => {
        try {
            getBooks(filterStatus).then(results => {
                console.log(results);
                setUserBooks(results);
                const filtered = filterBooks(results, selectedGenres, filterStatus);
                setDisplayedBooks(filtered);
            });

            localStorage.setItem('user_books_list', JSON.stringify(userBooks));
        } catch (error) {
            console.error('Error when executing the request:', error);
        }
    };

    const filterBooks = (books: Book[], genresFilter: string[], authorsFilter: string[]) => {
        return books.filter(book => {
            const matchesGenres = genresFilter.length === 0 || book.genres.some(genre => genresFilter.includes(genre));
            const matchesAuthors = authorsFilter.length === 0 || book.authors.some(author => authorsFilter.includes(author.name));
            return matchesGenres && matchesAuthors;
        });
    };

    const applyGenreFilter = () => {
        const filtered = filterBooks(userBooks, selectedGenres, selectedAuthors);
        setDisplayedBooks(filtered);
        handleClose();
    };

    const applyAuthorFilter = () => {
        const filtered = filterBooks(userBooks, selectedGenres, selectedAuthors);
        setDisplayedBooks(filtered);
        handleClose();
    };


    const renderUserBooks = () => {
        const booksResults = displayedBooks;

        //console.log("Ниже вывод " + JSON.stringify(booksResults));
        //console.log("Это массив? " + Array.isArray(booksResults));

        if (Array.isArray(booksResults)) {
            return (
                <BookList books={booksResults} booksPerPage={18}/>
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

    const renderGenres = () => {
        if (Array.isArray(genres)) {
            return genres.map((genre: string, index: number) => (
                <Form.Check
                    key={index}
                    type="checkbox"
                    label={genre}
                    checked={selectedGenres.includes(genre)}
                    onChange={() => handleGenreChange(genre)}
                />
            ))
        }
    }

    const renderAuthors = () => {
        if (Array.isArray(authors)) {
            return authors.map((authors: string, index: number) => (
                <Form.Check
                    key={index}
                    type="checkbox"
                    label={authors}
                    checked={selectedAuthors.includes(authors)}
                    onChange={() => handleAuthorChange(authors)}
                />
            ))
        }
    }

    return (
        <Container style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
            <AccountNav/>

            <Container>
                <Stack className=".d-flex justify-content-center align-items-center">
                    <h1>Мои книги</h1>
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
                        <Button variant="primary" disabled={activeFilterButtonIndex === 6} onClick={handleShow}>Сортировка по жанру</Button>
                        <Button variant="primary" disabled={activeFilterButtonIndex === 7} onClick={handleShowAuthors}>Сортировка по автору</Button>
                    </Stack>
                </Stack>
                <br/>
                {renderUserBooks()}

                <Modal show={show}
                    // size={"lg"}
                       centered={true}
                       onHide={() => {
                           handleClose();
                       }}
                       dialogClassName="modal-user-reviews"
                       aria-labelledby="example-custom-modal-styling-title">
                    <Modal.Header style={{border: 'none', paddingBottom: '0px'}} closeButton>
                        <Modal.Title>Выберите жанры</Modal.Title>
                    </Modal.Header>

                    <Modal.Body className="modal-dialog-scrollable" style={{maxHeight:'30rem', overflowY: 'auto'}}>
                        {renderGenres()}
                    </Modal.Body>
                    <Modal.Footer style={{border: 'none'}}>
                        <Button variant="outline-danger" onClick={() => {
                            handleClose();
                        }}>Отмена</Button>
                        <Button variant="outline-primary" onClick={() => {
                            applyGenreFilter();
                        }}>Применить</Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={showAuthors}
                    // size={"lg"}
                       centered={true}
                       onHide={() => {
                           handleCloseAuthors();
                       }}
                       dialogClassName="modal-user-reviews"
                       aria-labelledby="example-custom-modal-styling-title">
                    <Modal.Header style={{border: 'none', paddingBottom: '0px'}} closeButton>
                        <Modal.Title>Выберите авторов</Modal.Title>
                    </Modal.Header>

                    <Modal.Body className="modal-dialog-scrollable" style={{maxHeight:'30rem', overflowY: 'auto'}}>
                        {renderAuthors()}
                    </Modal.Body>
                    <Modal.Footer style={{border: 'none'}}>
                        <Button variant="outline-danger" onClick={() => {
                            handleCloseAuthors();
                        }}>Отмена</Button>
                        <Button variant="outline-primary" onClick={() => {
                            applyAuthorFilter();
                        }}>Применить</Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </Container>
    );
}

export default UserBooksPage;