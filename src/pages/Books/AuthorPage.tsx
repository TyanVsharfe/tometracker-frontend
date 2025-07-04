import React, {useEffect, useState} from 'react';
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import {useSearchParams} from "react-router-dom";
import {Spinner, Stack} from "react-bootstrap";
import {gBook, searchAuthor} from "../../services/bookService.ts";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";

const AuthorPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [searchResults, setSearchResults] = useState<gBook[]>([]);

    const [searchTerm, setsearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const searchQuery = searchParams.get("q");

        setsearchTerm(searchQuery || "");
        console.log("search query:", searchQuery);

        if (searchQuery != null && searchQuery != "") {
            setIsLoading(true);
            searchAuthor(searchQuery).then(results => {
                //localStorage.setItem('book_list', JSON.stringify(results));
                setSearchResults([]);
                console.log(results);
                setSearchResults(results);
                setIsLoading(false);
            });
        }
    }, [searchParams]);

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
                <h2 className='page-title'>Книги автора {searchTerm}</h2>
                <Container style={{ textAlign: "center", width: '35rem', paddingBottom: "10px" }}>
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
            </Stack>
        </Container>
    );
}


export default AuthorPage;

