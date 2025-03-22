import {useEffect, useState} from "react";
import Container from "react-bootstrap/Container";
import {Spinner, Stack} from "react-bootstrap";
import Row from "react-bootstrap/Row";
import {useSearchParams} from "react-router-dom";
import {gBook, searchBooks} from "../services/bookService.ts";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

import "../pages/style/book-card.css"

function SearchPage() {
    //const [isLoading, setIsLoading] = useState(false);
    const [searchParams] = useSearchParams();
    const [searchResults, setSearchResults] = useState<gBook[]>([]);

    useEffect(() => {
        const searchQuery = searchParams.get("q");
        console.log("search query:", searchQuery);

        if (searchQuery != null && searchQuery != "") {
            searchBooks(searchQuery).then(results => {
                //localStorage.setItem('book_list', JSON.stringify(results));
                setSearchResults([]);
                console.log(results);
                setSearchResults(results);
            });
        }
    }, [searchParams]);

    const renderSearchResults = () => {
        const gBooks = searchResults.items;
        console.log("render search results");
        console.log(gBooks);
        if (Array.isArray(gBooks)) {
            return gBooks.map((book: gBook, index: number) => (
                <Col key={index} style={{ paddingBottom: '20px' }} xxl={3} xl={3} lg={3} sm={3} xs={3}>
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
                <Row className="flex-wrap" style={{ display: 'flex', alignItems: 'flex-end' }} gap="4">
                    {renderSearchResults()}
                </Row>
            </Stack>
        </Container>
    );
}

export default SearchPage;