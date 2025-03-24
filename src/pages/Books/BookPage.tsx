import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import {Button, ListGroup, ListGroupItem, Stack, Table} from "react-bootstrap";
import {Link, useNavigate, useParams, useSearchParams} from "react-router-dom";
import {addBook, Book, gBook, getGBook} from "../../services/bookService.ts";
import BookControls from "../../components/BookControls.tsx";
import {formatDate} from "../../utils/Utils.ts";
import BookInfo from "../../components/BookInfo.tsx";
import {BookProvider} from "../../components/BookProvider.tsx";
import {BookPrice, findBookPrices} from "../../services/bookPriceService.ts";

import "../style/book-card.css"
import {addUserBook, checkEntity, getUserBook, UserBook} from "../../services/userBookService.ts";
import {useSelector} from "react-redux";
import {RootState} from "../../store/store.ts";

function BookPage() {
    const [book, setBook] = useState<gBook>();
    const [bookPrice, setBookPrice] = useState<BookPrice[]>();
    const [uBook, setUBook] = useState<UserBook>();
    const [bookHasStatus, setBookHasStatus] = useState(false);
    const gbId = useParams<{ id: string }>();
    const navigate = useNavigate(); //
    const isLogin = useSelector((state: RootState) => state.auth.isLogin);

    useEffect(() => {
        const fetchData = async () => {
            try {

                const status = await checkEntity(gbId.id)

                if (status != null) {
                    setBookHasStatus(status);

                    if (status) {
                        const bookData: UserBook = await getUserBook(gbId.id);
                        console.log(bookData);
                        setUBook(bookData);
                        console.log(uBook?.book);
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
                    //console.log(data?.volumeInfo?.industryIdentifiers);
                    findBookPrices(data?.volumeInfo?.title).then((bookPrice) => {
                        console.log(bookPrice);
                        const bookPrices = bookPrice.map((arr: BookPrice[]) => arr[0])
                            .filter((item: BookPrice): item is BookPrice => item !== undefined && item.price !== "");;
                        setBookPrice(bookPrices);
                    });
                });

            } catch (error) {
                console.error('Error fetching game data:', error);
            }
        };

        fetchData();
    }, [gbId]);

    const handleAddBook = () => {
        if (!isLogin) {
            navigate('/login');
        } else {
            addBook(book).then(() => {
                addUserBook(gbId.id).then(() => {
                    setBookHasStatus(true);
                });
            });
        }
    };

    return (
        <BookProvider initialStatus={uBook?.status} initialUserRating={uBook?.userRating}>
            <Stack className="book-page" direction="horizontal" style={{paddingTop: "20px"}} gap={5}>
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
                            <Button type={"button"} onClick={handleAddBook}>Добавить книгу</Button>
                        )}
                    </Card.Body>
                    <Card.Footer className="text-muted">
                        {formatDate(book?.volumeInfo?.publishedDate) === undefined ? "Неизвестно" : formatDate(book?.volumeInfo?.publishedDate)}
                    </Card.Footer>
                </Card>

                <Stack style={{maxWidth: '500px'}}>
                    <div style={{maxWidth: '500px'}}>
                        {/*height: '20rem'*/}
                        <h2>Описание:</h2>
                        <span className='book__description'>{book?.volumeInfo?.description}</span>
                    </div>
                    <Container style={{display: 'flex', flexDirection: 'column', padding: '0px 0px 0px 0px'}}>
                        {bookPrice != undefined ? (
                            <Table style={{alignItems: 'start'}} responsive>
                                <thead>
                                <tr>
                                    <th>Магазин</th>
                                    <th>Цена</th>
                                    <th>Ссылка</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    bookPrice.map(book => (
                                        <tr>
                                            <td>{book.shop}</td>
                                            <td>{book.price}</td>
                                            <td><a style={{
                                                textDecoration: 'none',
                                                pointerEvents: book.url ? 'auto' : 'none',
                                                color: book.url ? 'inherit' : 'gray'
                                            }} href={`${book.url}`}>Купить</a></td>
                                        </tr>
                                    ))
                                }
                                </tbody>
                            </Table>
                            ) : <></>}
                    </Container>
                </Stack>

                <div>
                    {bookHasStatus ? (<BookInfo/>) : <></>}
                    <Card data-bs-theme="dark" style={{width: '15rem'}}>
                    <Card.Header>Информация о книге:</Card.Header>
                        <Card.Body>
                            Автор: {book?.volumeInfo?.authors[0]}<br/>
                            Количество страниц: {book?.volumeInfo?.pageCount}<br/>
                            Издатель: {book?.volumeInfo?.publisher}
                        </Card.Body>
                        <Card.Footer>
                        </Card.Footer>
                    </Card>
                </div>
            </Stack>
        </BookProvider>
    );
}

export default BookPage;
