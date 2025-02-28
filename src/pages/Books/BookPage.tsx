import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import {Button, Stack} from "react-bootstrap";
import {Link, useParams, useSearchParams} from "react-router-dom";
import {addBook, Book, checkEntity, gBook, getBook, getGBook} from "../../services/bookService.ts";
import BookControls from "../../components/BookControls.tsx";
import {formatDate} from "../../utils/Utils.ts";
import BookInfo from "../../components/BookInfo.tsx";
import {BookProvider} from "../../components/BookProvider.tsx";

function BookPage() {
    const [book, setBook] = useState<gBook>();
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

                const data: gBook = await getGBook(gbId.id);
                console.log(gbId.id);
                console.log("Book data");
                console.log(data);
                const keyStorage = `/books/${gbId}`;
                localStorage.setItem(keyStorage, JSON.stringify(data));
                setBook(data);
                //console.log(book?.volumeInfo?.industryIdentifiers[1])
            } catch (error) {
                console.error('Error fetching game data:', error);
            }
        };

        fetchData();
    }, [gbId]);

    return (
        <BookProvider initialStatus={uBook?.status} initialUserRating={uBook?.userRating}>
            <Stack className=".d-flex justify-content-center align-items-center" direction="horizontal" style={{paddingTop: "20px"}} gap={5}>
                <Card data-bs-theme="dark" style={{width: '15rem'}} className="text-center" border="light">
                    <Card.Img variant="top" src={book?.volumeInfo?.imageLinks?.thumbnail || ''}/>
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

                <div style={{width: '500px'}}>
                    <h2>Book Information</h2>
                    <span>{book?.volumeInfo?.description}</span>
                </div>

                {bookHasStatus ? (<BookInfo/>): <></>}
            </Stack>
        </BookProvider>
    );
}

export default BookPage;
