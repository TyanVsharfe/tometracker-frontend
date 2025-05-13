import React, {useState, useEffect, useRef} from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Accordion from 'react-bootstrap/Accordion';
import {Button, Dropdown, Stack, Table} from "react-bootstrap";
import {useNavigate, useParams} from "react-router-dom";
import {addBook, gBook, getGBook} from "../../services/bookService.ts";
import BookControls from "../../components/BookControls.tsx";
import {formatDate, getRatingColor, getScoreClass} from "../../utils/Utils.ts";
import BookInfo from "../../components/BookInfo.tsx";
import {BookProvider} from "../../components/BookProvider.tsx";
import Form from "react-bootstrap/Form";
import {BookPrice, findBookPrices, ShopBookPrice} from "../../services/bookPriceService.ts";

import "../style/book-card.css"
import "../style/modal.css"
import "../style/accordion.css"
import {
    addUserBook,
    BookReview,
    checkEntity, deleteBookReview,
    getAllBookReviews,
    getUserBook, updateBookReview,
    UserBook
} from "../../services/userBookService.ts";
import {useSelector} from "react-redux";
import {RootState} from "../../store/store.ts";
import Modal from "react-bootstrap/Modal";
import Title from "../../components/Title.tsx";
import Review from "../../components/Review.tsx";

function BookPage() {
    const [book, setBook] = useState<gBook>();
    const [bookPrice, setBookPrice] = useState<ShopBookPrice[]>();
    const [allBookPrice, setAllBookPrice] = useState<BookPrice[]>();
    const [bookReviews, setbookReviews] = useState<BookReview[]>();
    const [uBook, setUBook] = useState<UserBook>();
    const [bookHasStatus, setBookHasStatus] = useState(false);
    const gbId = useParams<{ id: string }>();
    const navigate = useNavigate(); //
    const isLogin = useSelector((state: RootState) => state.auth.isLogin);
    const [show, setShow] = useState(false);
    const [showUserReview, setShowUserReview] = useState(false);
    const [showUsersReview, setShowUsersReview] = useState(false);
    const [reviewContent, setReviewContent] = useState("");
    const [sortOrder, setSortOrder] = useState('none');

    const [expanded, setExpanded] = useState(false);
    const [isOverflowing, setIsOverflowing] = useState(false);
    const descriptionTextRef = useRef<HTMLDivElement>(null);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleCloseUsersReview = () => setShowUsersReview(false);
    const handleShowUsersReview = () => setShowUsersReview(true);
    const handleCloseUserReview = () => setShowUserReview(false);
    const handleShowUserReview = () => setShowUserReview(true);
    const reviewContentChange = (e) => setReviewContent(e.target.value);

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
                        if (bookData.review != undefined) {
                            setReviewContent(bookData.review)
                        }
                        console.log(bookData?.book.authors[0].name);
                        console.log(bookData?.status);
                        console.log("---------------------")

                        if (descriptionTextRef.current) {
                            const isTextOverflowing = descriptionTextRef.current.scrollHeight > descriptionTextRef.current.clientHeight;
                            setIsOverflowing(isTextOverflowing);
                        }
                        findBookPrices(bookData?.book.title, bookData?.book.authors[0].name).then((bookPrices) => {
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
                    }
                    else {
                        getGBook(gbId.id).then((data) => {
                            console.log(gbId.id);
                            console.log("Book data");
                            console.log(data);
                            const keyStorage = `/books/${gbId}`;
                            localStorage.setItem(keyStorage, JSON.stringify(data));
                            setBook(data);
                            if (descriptionTextRef.current) {
                                const isTextOverflowing = descriptionTextRef.current.scrollHeight > descriptionTextRef.current.clientHeight;
                                setIsOverflowing(isTextOverflowing);
                            }
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
                    }
                }
                else {
                    getGBook(gbId.id).then((data) => {
                        console.log(gbId.id);
                        console.log("Book data");
                        console.log(data);
                        const keyStorage = `/books/${gbId}`;
                        localStorage.setItem(keyStorage, JSON.stringify(data));
                        setBook(data);
                        if (descriptionTextRef.current) {
                            const isTextOverflowing = descriptionTextRef.current.scrollHeight > descriptionTextRef.current.clientHeight;
                            setIsOverflowing(isTextOverflowing);
                        }
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
                }

                const bookReviews = await getAllBookReviews(gbId.id);
                console.log(bookReviews)
                if (bookReviews != null)
                    setbookReviews(bookReviews);

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

    const handleClick = (author: string) => {
        window.open(`/books/author?q=${author}`, '_blank');
    };

    const reviewsWithScores = bookReviews != undefined ? bookReviews.filter(review => review.userRating !== null) : [];

    const averageScore = reviewsWithScores.length > 0
        ? Math.round(reviewsWithScores.reduce((acc, review) => acc + review.userRating, 0) / reviewsWithScores.length)
        : 0;

    return (
        <BookProvider initialStatus={uBook?.status} initialUserRating={uBook?.userRating}>
            <Stack className="book-page" direction="horizontal" style={{paddingTop: "20px"}} gap={5}>
                <Card data-bs-theme="dark" style={{width: '15rem'}} className="text-center" border="light">
                    <Card.Img variant="top" src={book === undefined ?
                        uBook?.book.coverUrl:
                        (book?.volumeInfo?.imageLinks?.thumbnail || '')}/>
                    <Card.Body>
                        <Card.Title>{book === undefined ?
                            uBook?.book.title:
                            book?.volumeInfo?.title}</Card.Title>
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
                        {book === undefined ?
                            formatDate(uBook?.book.publishedDate) === undefined ?
                                "Неизвестно" : formatDate(uBook?.book.publishedDate):
                            formatDate(book?.volumeInfo?.publishedDate) === undefined ?
                                "Неизвестно" : formatDate(book?.volumeInfo?.publishedDate)}
                    </Card.Footer>
                </Card>

                <Stack style={{maxWidth: '500px'}}>
                    <div style={{maxWidth: '500px'}}>
                        {/*height: '20rem'*/}
                        <h2>Описание:</h2>
                        <span className={`book__description ${expanded ? "expanded" : ""}`} ref={descriptionTextRef}>
                            {book === undefined ?
                                uBook?.book.description:
                                book?.volumeInfo?.description}</span>
                        {isOverflowing && (
                            <button className='book__description-button' onClick={() => setExpanded(!expanded)}>
                                {expanded ? "Скрыть" : "Читать далее"}
                            </button>
                        )}
                    </div>
                    <Accordion defaultActiveKey="0" flush={true} className="accordion">
                        <Accordion.Item eventKey="0">
                            <Accordion.Header className="accordion-top">
                                <Button style={{width: "100%"}}>Цены на книгу</Button>
                            </Accordion.Header>
                            <Accordion.Body>
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
                                            <Accordion.Header>
                                                <Button style={{width: "100%"}}>Скрыть</Button>
                                            </Accordion.Header>
                                        </>

                                    ) : <></>}
                                </Container>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </Stack>

                <div>
                    {bookHasStatus ? (<BookInfo/>) : <></>}
                    <Card data-bs-theme="dark" style={{width: '15rem'}}>
                    <Card.Header>Информация о книге:</Card.Header>
                        <Card.Body>
                            Автор: {book === undefined ?
                            (uBook?.book.authors.map(author => (
                                <a onClick={() => {
                                    handleClick(author.name)
                                }}
                                   style={{textDecoration: 'none', color: 'inherit', cursor: 'pointer'}}
                                   key={author.id}>{author.name}</a>
                            ))) : <></>}
                            <br/>
                            Количество страниц: {book === undefined ?
                            uBook?.book.pageCount :
                            book?.volumeInfo?.pageCount}<br/>
                            Издатель: {book === undefined ?
                                uBook?.book.publisher:
                                book?.volumeInfo?.publisher}<br/>
                            Жанр:
                            {book === undefined ?
                                (uBook?.book.genres.map((category, index) => (
                                    <div className="book-info-genre" key={index}>{category}</div>
                                ))) :
                                (book?.volumeInfo?.categories?.map((category, index) => (
                                <div className="book-info-genre" key={index}>{category}</div>
                                )))}
                        </Card.Body>
                        <Card.Footer>
                        </Card.Footer>
                    </Card>
                    <Stack>
                        {bookHasStatus ? (
                                <Button style={{width: '15rem', marginTop: '10px'}} onClick={handleShowUserReview}>Ваша рецензия</Button>)
                            : <></>}
                        <Button style={{width: '15rem', marginTop: '10px'}} onClick={handleShowUsersReview}>Рецензии</Button>
                    </Stack>

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
                <Modal.Body className="modal-dialog-scrollable pt-2">
                    <Container style={{height: '30rem', overflowY: 'auto'}}>
                        {allBookPrice != undefined ? (
                            <>
                                <div className="pt-2 pb-0 d-flex justify-content-end">
                                    <Dropdown>
                                        <Dropdown.Toggle variant="outline-primary" size="sm" id="dropdown-sort">
                                            {sortOrder === 'none' ? 'Сортировка по цене' :
                                                sortOrder === 'asc' ? 'От дешевых к дорогим' :
                                                    'От дорогих к дешевым'}
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item onClick={() => setSortOrder('none')}>Без
                                                сортировки</Dropdown.Item>
                                            <Dropdown.Item onClick={() => setSortOrder('asc')}>От дешевых к
                                                дорогим</Dropdown.Item>
                                            <Dropdown.Item onClick={() => setSortOrder('desc')}>От дорогих к
                                                дешевым</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
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
                                        [...allBookPrice]
                                            .flatMap(book =>
                                                book.books.map(bookInfo => ({
                                                    shop: book.shop,
                                                    bookInfo: bookInfo
                                                }))
                                            )
                                            .filter(item => item.bookInfo.price && item.bookInfo.price !== 'Нет в продаже')
                                            .sort((a, b) => {
                                                if (sortOrder === 'none') return 0;

                                                const priceA = parseFloat(a.bookInfo.price.replace(/[^\d.,]/g, '').replace(',', '.')) || 0;
                                                const priceB = parseFloat(b.bookInfo.price.replace(/[^\d.,]/g, '').replace(',', '.')) || 0;

                                                return sortOrder === 'asc' ? priceA - priceB : priceB - priceA;
                                            })
                                            .map((item, index) => (
                                                <tr key={`book-${index}`}>
                                                    <td className='book-price__item'>{item.shop}</td>
                                                    <td className='book-price__item'><Title
                                                        title={item.bookInfo.title}/></td>
                                                    <td className='book-price__item'>{item.bookInfo.price}</td>
                                                    <td className='book-price__item'>
                                                        <Button
                                                            variant="primary"
                                                            disabled={!item.bookInfo.url}
                                                            onClick={() => {
                                                                if (item.bookInfo.url) {
                                                                    window.open(item.bookInfo.url, '_blank');
                                                                }
                                                            }}>
                                                            Купить
                                                        </Button>
                                                    </td>
                                                </tr>
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

            <Modal show={showUserReview}
                //size={"lg"}
                   centered={true}
                   onHide={() => {
                       handleCloseUserReview();
                       if (uBook?.review != undefined) {
                           setReviewContent(uBook?.review)
                       }
                   }}
                // fullscreen={true}
                   aria-labelledby="example-custom-modal-styling-title">
                <Modal.Header style={{border: 'none', paddingBottom: '0px'}} closeButton>
                    <Modal.Title>Составить рецензию</Modal.Title>
                </Modal.Header>

                <Modal.Body className="modal-dialog-scrollable">
                    <Container style={{maxHeight: '30rem', overflowY: 'auto'}}>
                        <Form>
                            <Form.Label><h5>Текст рецензии</h5></Form.Label>
                            <Form.Control style={{height: '25rem', resize: 'none'}} as="textarea" rows={3} placeholder="Ваша рецензия" onChange={reviewContentChange}
                                          defaultValue={`${reviewContent}`}
                            />
                        </Form>
                    </Container>
                </Modal.Body>

                <Modal.Footer style={{border: 'none'}}>
                    <Button variant="outline-danger" onClick={() => {
                        deleteBookReview(gbId.id, reviewContent).then(() => handleCloseUserReview())
                    }}>Удалить</Button>
                    <Button variant="outline-primary" onClick={() => {
                        updateBookReview(gbId.id, reviewContent).then(() => handleCloseUserReview())
                    }}>Сохранить</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showUsersReview}
                // size={"lg"}
                   centered={true}
                   onHide={() => {
                       handleCloseUsersReview();
                   }}
                   dialogClassName="modal-user-reviews"
                   aria-labelledby="example-custom-modal-styling-title">
                <Modal.Header style={{border: 'none', paddingBottom: '0px'}} closeButton>
                    <Modal.Title>Рецензии пользователей</Modal.Title>
                </Modal.Header>

                {averageScore !== null && (
                    <div style={{
                        backgroundColor: '#fff8e1',
                        padding: '10px 16px',
                        margin: '1rem 1.5rem 0.5rem',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}>
                        <div style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            backgroundColor: getRatingColor(averageScore)
                        }}></div>
                        <div>
                            <strong>Средняя оценка: {averageScore}</strong><br />
                            <span style={{ fontSize: '0.9rem', color: '#777' }}>
                                (на основе отзывов с оценкой: {reviewsWithScores.length})
                            </span>
                        </div>
                    </div>
                )}


                <Modal.Body className="modal-dialog-scrollable" style={{maxHeight: '30rem', overflowY: 'auto'}}>
                    {bookReviews ? (
                        <>
                            <Stack style={{
                                maxWidth: '50rem',
                                display: 'flex',
                                justifyContent: 'start',
                                justifySelf: 'start'
                            }}>
                                {
                                    bookReviews.map((bookReview: BookReview) => (
                                        <Review bookReview={bookReview}/>
                                    ))
                                }
                            </Stack>
                        </>
                    ) : <></>}
                </Modal.Body>

                <Modal.Footer style={{border: 'none'}}>
                    <Button variant="outline-primary" onClick={() => {
                        handleCloseUsersReview()
                    }}>Закрыть</Button>
                </Modal.Footer>
            </Modal>
        </BookProvider>
    );
}

export default BookPage;
