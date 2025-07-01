import React, { useState } from 'react';
import { Container, Col, Card, Button, Pagination, Row } from 'react-bootstrap';
import {Book} from "../services/userBookService.ts";
import "../pages/styles/style.css"
import "../pages/styles/book-card.css"

export interface BooksListProps {
    books: Book[];
    booksPerPage?: number;
}

const BooksList: React.FC<BooksListProps> = ({ books, booksPerPage = 15 }) => {
    const [currentPage, setCurrentPage] = useState<number>(1);

    const totalPages = Math.ceil(books.length / booksPerPage);

    const indexOfLastBook = currentPage * booksPerPage;
    const indexOfFirstBook = indexOfLastBook - booksPerPage;
    const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const renderPaginationItems = () => {
        let items = [];

        items.push(
            <Pagination.Prev
                key="prev"
                onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
            />
        );

        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        // Корректировка, если мы близко к концу
        if (endPage - startPage + 1 < maxVisiblePages && startPage > 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        if (startPage > 1) {
            items.push(
                <Pagination.Item key={1} onClick={() => handlePageChange(1)}>
                    1
                </Pagination.Item>
            );
            if (startPage > 2) {
                items.push(<Pagination.Ellipsis key="ellipsis-start" />);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            items.push(
                <Pagination.Item
                    key={i}
                    active={i === currentPage}
                    onClick={() => handlePageChange(i)}
                >
                    {i}
                </Pagination.Item>
            );
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                items.push(<Pagination.Ellipsis key="ellipsis-end" />);
            }
            items.push(
                <Pagination.Item
                    key={totalPages}
                    onClick={() => handlePageChange(totalPages)}
                >
                    {totalPages}
                </Pagination.Item>
            );
        }

        items.push(
            <Pagination.Next
                key="next"
                onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            />
        );

        return items;
    };

    return (
        <>
            <Container className="justify-content-start align-items-center books-list">
                <Row>
                    {currentBooks.map((book: Book, index: number) => (
                        <Col
                            key={index}
                            xs={6} sm={4} md={3} lg={2}
                            className="mb-4 d-flex justify-content-center"
                            style={{width:'10.5rem'}}
                        >
                            <Card data-bs-theme='dark' style={{ width: '9rem' }} className='text-center' border='light'>
                                <Card.Img className='book__cover' variant="top" src={book?.coverUrl || ''} />
                                <Card.Body className='book__body'>
                                    <Container style={{ height: '60px' }}>
                                        <Card.Title className="book__title">
                                            {book.title}
                                        </Card.Title>
                                    </Container>
                                    <Card.Text>
                                    </Card.Text>
                                    <Button
                                        style={{ width: '90%', fontSize: '12px' }}
                                        variant='primary'
                                        href={`/books/${book.gbId}`}
                                    >
                                        Подробнее
                                    </Button>
                                </Card.Body>
                                <Card.Footer className='text-muted'>
                                </Card.Footer>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>

            {totalPages > 1 && (
                <Container className="d-flex justify-content-center mt-4 mb-5">
                    <Pagination>{renderPaginationItems()}</Pagination>
                </Container>
            )}
        </>
    );
};

export default BooksList;

