import React, {useEffect, useState} from "react";
import Container from "react-bootstrap/Container";
import {Spinner, Stack} from "react-bootstrap";
import Row from "react-bootstrap/Row";
import {useNavigate, useSearchParams} from "react-router-dom";
import {gBook, searchBooks} from "../../services/bookService.ts";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

import "../style/book-card.css"
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import {enumGenres, enumSaveGenres} from "../../utils/Enums.ts";

function SearchPage() {
    const [searchParams] = useSearchParams();
    const [searchResults, setSearchResults] = useState<gBook[]>([]);
    const navigate = useNavigate();

    const [searchTerm, setsearchTerm] = useState("");
    const [filter, setFilter] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [show, setShow] = useState(false);
    const [selectedGenre, setSelectedGenre] = useState<string>("");

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        const searchQuery = searchParams.get("q");
        const savedFilter = searchParams.get("filter") || "";

        setsearchTerm(searchQuery || "");
        setFilter(savedFilter);
        console.log("search query:", searchQuery);

        if (searchQuery != null && searchQuery != "") {
            setIsLoading(true);
            searchBooks(filter, searchQuery, selectedGenre).then(results => {
                //localStorage.setItem('book_list', JSON.stringify(results));
                setSearchResults([]);
                console.log(results);
                setSearchResults(results);
                setIsLoading(false);
            });
        }
    }, [searchParams]);

    const handleGenreChange = (genre: enumSaveGenres) => {
        setSelectedGenre(genre);
        console.log('Сохраненный жанр:', genre);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (filter === "") {
            navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
        }
        else {
            navigate(`/search?q=${encodeURIComponent(searchTerm)}&filter=${encodeURIComponent(filter)}`);
        }
    };

    const renderSearchResults = () => {
        const gBooks = searchResults.items;
        console.log("render search results");
        console.log(gBooks);
        if (Array.isArray(gBooks)) {
            return gBooks.map((book: gBook, index: number) => (
                <Col key={index} style={{paddingBottom: '20px', flex: '0 1 calc(20%)'}}>
                    <Card data-bs-theme='dark' style={{ width: '9rem' }} className='text-center' border='light'>
                        <Card.Img className='book__cover' variant='top' src={book.volumeInfo.imageLinks?.thumbnail} />
                        <Card.Body className='book__body'>
                            <Card.Title className='book__title'>
                                {book.volumeInfo.title}
                            </Card.Title>
                            <Card.Text>

                            </Card.Text>
                            <Button   style={{
                                padding: '8px 16px',
                                fontSize: '12px',
                            }}  variant='primary' href={`/books/${book.id}`}>Подробнее</Button>
                        </Card.Body>
                    </Card>
                </Col>
            ));
        }
    };

    return (
        <Container>
            <Stack className=".d-flex justify-content-center align-items-center">
                <h2 className='page-title'>Результаты</h2>
                <Container style={{ textAlign: "center", width: '35rem', paddingBottom: "10px" }}>
                    <Form className="mb-4 w-100" style={{ maxWidth: "600px" }} onSubmit={handleSubmit}>
                        <Row className="justify-content-center g-2">
                            <Col xs="auto" className="mx-2">
                                <Form.Select value={filter} onChange={(e) => setFilter(e.target.value)}>
                                    <option value="">Отсутствует</option>
                                    <option value="intitle">Название</option>
                                    <option value="inauthor">Автор</option>
                                    <option value="isbn">ISBN</option>
                                </Form.Select>
                            </Col>
                            <Col xs="auto" className="mx-2">
                                <Button variant="primary" onClick={handleShow}>Поиск по жанру</Button>
                            </Col>
                        </Row>

                        <Row className="justify-content-center g-2 mt-2">
                            <Col xs="auto" className="mx-2">
                                <Form.Control
                                    type="text"
                                    placeholder="Введите поисковый запрос..."
                                    value={searchTerm}
                                    onChange={(e) => setsearchTerm(e.target.value)}
                                    style={{ width: '250px' }}
                                />
                            </Col>
                            <Col xs="auto" className="mx-2">
                                <Button variant="primary" type="submit">
                                    Поиск
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Container>
                {isLoading ? (
                    <Container style={{display: "flex", justifyContent: "center", paddingBottom: '20px'}}>
                        <Spinner animation="border" variant="primary" />
                    </Container>
                ) : (
                    <Container className="justify-content-start align-items-center books-list">
                        {renderSearchResults()}
                    </Container>
                )}
                <span style={{borderRadius: "12px"}}>Не нашли нужной книги? Попробуйте поиск по ISBN.</span>
            </Stack>

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
                    <Form>
                        {Object.values(enumGenres).map((displayGenre) => {
                            const saveGenreKey = Object.keys(enumGenres).find(key => enumGenres[key as keyof typeof enumGenres] === displayGenre);
                            if (saveGenreKey) {
                                const genreValue = enumSaveGenres[saveGenreKey as keyof typeof enumSaveGenres];
                                return (
                                    <Form.Check
                                        key={displayGenre}
                                        type="radio"
                                        id={`genre-${displayGenre}`}
                                        name="genre"
                                        label={displayGenre}
                                        checked={selectedGenre === enumSaveGenres[saveGenreKey as keyof typeof enumSaveGenres]}
                                        onChange={() => handleGenreChange(genreValue)}
                                        className="mb-2"
                                    />
                                );
                            }
                        })}
                    </Form>
                </Modal.Body>
                <Modal.Footer style={{border: 'none'}}>
                    <Button variant="outline-danger" onClick={() => {
                        handleClose();
                    }}>Отмена</Button>
                    <Button variant="outline-primary" onClick={() => {
                        console.log("Выбран жанр:", selectedGenre);
                        handleClose();
                    }}>Применить</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default SearchPage;