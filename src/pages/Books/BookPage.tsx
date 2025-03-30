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
import {BookPrice, findBookPrices, ShopBookPrice} from "../../services/bookPriceService.ts";

import "../style/book-card.css"
import {addUserBook, checkEntity, getUserBook, UserBook} from "../../services/userBookService.ts";
import {useSelector} from "react-redux";
import {RootState} from "../../store/store.ts";
import Modal from "react-bootstrap/Modal";
import Title from "../../components/Title.tsx";

function BookPage() {
    const [book, setBook] = useState<gBook>();
    const [bookPrice, setBookPrice] = useState<ShopBookPrice[]>();
    const [allBookPrice, setAllBookPrice] = useState<BookPrice[]>();
    const [uBook, setUBook] = useState<UserBook>();
    const [bookHasStatus, setBookHasStatus] = useState(false);
    const gbId = useParams<{ id: string }>();
    const navigate = useNavigate(); //
    const isLogin = useSelector((state: RootState) => state.auth.isLogin);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

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
                    findBookPrices(data?.volumeInfo?.title, data?.volumeInfo?.authors[0]).then((bookPrices) => {
                        console.log(bookPrices);
                        setAllBookPrice(bookPrices);

                        const shopBookPrices: ShopBookPrice[] = bookPrices.map((shopData: BookPrice) => {
                            const book = shopData.books[0];
                            return {
                                shop: shopData.shop,
                                book: book,
                            };
                        }).filter((item: ShopBookPrice) => item.book !== undefined && item.book.price !== "");

                        setBookPrice(shopBookPrices);
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
                            <>
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
                                                <td>{book.book.price}</td>
                                                <td><a style={{
                                                    textDecoration: 'none',
                                                    pointerEvents: book.book.url ? 'auto' : 'none',
                                                    color: book.book.url ? 'inherit' : 'gray'
                                                }} href={`${book.book.url}`}>Купить</a></td>
                                            </tr>
                                        ))
                                    }
                                    </tbody>
                                </Table>
                                <Button onClick={handleShow}>Подробнее</Button>
                            </>

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

            <Modal show={show}
                   size={"lg"}
                   centered={true}
                   onHide={handleClose}
                // fullscreen={true}
                   dialogClassName="modal-90w"
                   aria-labelledby="example-custom-modal-styling-title">
                <Modal.Header closeButton>
                    <Modal.Title>Цены на книгу</Modal.Title>
                </Modal.Header>

                <Modal.Body className="modal-dialog-scrollable">
                    <Container style={{height: '30rem', overflowY: 'auto'}}>
                        {allBookPrice != undefined ? (
                            <>
                                <Table responsive>
                                    <thead>
                                    <tr>
                                        <th>Магазин</th>
                                        <th>Название</th>
                                        <th>Цена</th>
                                        <th>Ссылка</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        allBookPrice.map(book => (
                                            book.books.map(bookInfo => (
                                                <tr>
                                                    <td className='book-price__item'>{book.shop}</td>
                                                    <td className='book-price__item'><Title title={bookInfo.title}/></td>
                                                    <td className='book-price__item'>{bookInfo.price}</td>
                                                    <td className='book-price__item'>
                                                        <Button
                                                        variant="primary"
                                                        disabled={!bookInfo.url} // Отключаем кнопку, если URL отсутствует
                                                        onClick={() => {
                                                            if (bookInfo.url) {
                                                                window.open(bookInfo.url, '_blank'); // Открываем ссылку в новой вкладке
                                                            }
                                                        }}>
                                                        Купить
                                                    </Button></td>
                                                </tr>
                                            ))
                                        ))
                                    }
                                    </tbody>
                                </Table>
                            </>
                        ) : <></>}
                    </Container>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="outline-primary" onClick={handleClose}>Закрыть</Button>
                </Modal.Footer>
            </Modal>
        </BookProvider>
    );
}

export default BookPage;
