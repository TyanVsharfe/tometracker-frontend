import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import {Button, ListGroup, ListGroupItem, Stack} from "react-bootstrap";
import {Link, useParams, useSearchParams} from "react-router-dom";
import {addBook, Book, checkEntity, gBook, getBook, getGBook} from "../../services/bookService.ts";
import BookControls from "../../components/BookControls.tsx";
import {formatDate} from "../../utils/Utils.ts";
import BookInfo from "../../components/BookInfo.tsx";
import {BookProvider} from "../../components/BookProvider.tsx";
import {BookPrice, findBookPrices} from "../../services/bookPriceService.ts";

import "../style/book-card.css"

function BookPage() {
    const [book, setBook] = useState<gBook>();
    const [bookPrice, setBookPrice] = useState<BookPrice[]>();
    const [uBook, setUBook] = useState<Book>();
    const [bookHasStatus, setBookHasStatus] = useState(false);
    const gbId = useParams<{ id: string }>();

    useEffect(() => {
        const fetchData = async () => {
            try {

                const status = await checkEntity(gbId.id)

                if (status != null) {
                    setBookHasStatus(status);

                    if (status) {
                        const bookData: Book = await getBook(gbId.id);
                        setUBook(bookData);
                        console.log(uBook?.userRating);
                        console.log(uBook?.status);
                    }
                }

                getGBook(gbId.id).then((data) => {
                    console.log(gbId.id);
                    console.log("Book data");
                    console.log(data);
                    const keyStorage = `/books/${gbId}`;
                    localStorage.setItem(keyStorage, JSON.stringify(data));
                    setBook(data);
                    console.log(data?.volumeInfo?.industryIdentifiers);
                    findBookPrices(data?.volumeInfo?.industryIdentifiers[1].identifier).then((bookPrice) => {
                        setBookPrice(bookPrice);
                        console.log(bookPrice)
                    });
                });

            } catch (error) {
                console.error('Error fetching game data:', error);
            }
        };

        fetchData();
    }, [gbId]);

    return (
        <BookProvider initialStatus={uBook?.status} initialUserRating={uBook?.userRating}>
            <Stack className="d-flex justify-content-center align-items-center book-page" direction="horizontal" style={{paddingTop: "20px"}} gap={5}>
                <Card data-bs-theme="dark" style={{width: '15rem'}} className="text-center" border="light">
                    <Card.Img variant="top" src={book?.volumeInfo?.imageLinks?.medium || ''}/>
                    <Card.Body>
                        <Card.Title>{book?.volumeInfo.title}</Card.Title>
                        <Card.Text>
                            <Container>
                            </Container>
                        </Card.Text>
                        {bookHasStatus ? (
                            <BookControls/>
                        ) : (
                            <Button type={"button"} onClick={() => {addBook(book).then(() => setBookHasStatus(true))}}>Add book</Button>
                        )}
                    </Card.Body>
                    <Card.Footer className="text-muted">
                        {formatDate(book?.volumeInfo?.publishedDate)}
                    </Card.Footer>
                </Card>

                <div style={{maxWidth: '500px'}}>
                    <h2>Book Information</h2>
                    <span>{book?.volumeInfo?.description}</span>
                </div>

                <div>
                    {bookHasStatus ? (<BookInfo/>): <></>}
                    <Card data-bs-theme="dark" style={{width: '15rem'}}>
                        <Card.Header></Card.Header>
                        <Card.Body>
                            Количество страниц: {book?.volumeInfo?.pageCount}<br/>
                            Издатель: {book?.volumeInfo?.publisher}
                        </Card.Body>
                        <Card.Footer>
                        </Card.Footer>
                    </Card>
                </div>
            </Stack>
            <Container style={{display: 'flex', flexDirection: 'column'}}>
                {bookPrice != undefined ? (
                    <Card data-bs-theme="dark" className='text-center book__prices' border='light'>
                        <Card.Body style={{display: 'flex', justifyContent: 'space-between'}}>
                            <ListGroup horizontal>
                                {
                                    bookPrice.map(book => (
                                        <ListGroupItem>
                                            <h4>{book.shop}</h4>
                                            <h4>Цена: {book.price}</h4>
                                            <Card.Link style={{
                                                textDecoration: 'none',
                                                pointerEvents: book.url ? 'auto' : 'none',
                                                color: book.url ? 'inherit' : 'gray'
                                            }} href={`${book.url}`}>Купить</Card.Link>
                                        </ListGroupItem>)
                                    )
                                }
                            </ListGroup>
                        </Card.Body>
                    </Card>
                ): <></>}
            </Container>
        </BookProvider>
    );
}

export default BookPage;
