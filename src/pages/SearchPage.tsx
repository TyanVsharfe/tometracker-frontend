import {useEffect, useState} from "react";
import Container from "react-bootstrap/Container";
import {Spinner, Stack} from "react-bootstrap";
import Row from "react-bootstrap/Row";
import {useSearchParams} from "react-router-dom";
import {gBook, searchBooks} from "../services/bookService.ts";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import {shortTitle} from "../utils/Utils.ts";

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
                    <Card data-bs-theme="dark" style={{ width: '9rem' }} className="text-center" border='light'>
                        <Card.Img variant="top" src={book.volumeInfo.imageLinks?.thumbnail} />
                        <Card.Body style={{ height: '135px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <Card.Title style={{fontSize: '14px'}}>{book.volumeInfo.title.length > 30 ?
                                shortTitle(book.volumeInfo.title) : book.volumeInfo.title}</Card.Title>
                            <Card.Text>

                            </Card.Text>
                            <Button   style={{
                                padding: '8px 16px', // уменьшите отступы
                                fontSize: '12px',   // уменьшите размер шрифта
                            }}  variant="primary" href={`/books/${book.id}`}>Get info</Button>
                        </Card.Body>
                    </Card>
                </Col>
            ));
        }
    };

    return (
        <Container>
            <Stack className=".d-flex justify-content-center align-items-center">
                <h2>Search result</h2>
                <Row className="flex-wrap" style={{ display: 'flex', alignItems: 'flex-end' }} gap="4">
                    {renderSearchResults()}
                </Row>
            </Stack>
        </Container>
    );
}

export default SearchPage;