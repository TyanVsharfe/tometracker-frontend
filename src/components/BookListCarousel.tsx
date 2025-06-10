import React, {useState, useEffect, useRef} from 'react';
import { Container, Col, Card, Button, Pagination, Row } from 'react-bootstrap';
import {Book} from "../services/userBookService.ts";
import "../pages/style/style.css"
import "../pages/style/book-card.css"
import {Link} from "react-router-dom";

export interface BooksListProps {
    books: Book[];
    carouselRef: React.RefObject<HTMLDivElement>;
    width: number
}

const BooksListCarousel: React.FC<BooksListProps> = ({ books, carouselRef, width }) => {

    const handleScrollLeft = (ref: React.RefObject<HTMLDivElement>) => {
        if (ref.current) {
            ref.current.scrollBy({ left: -300, behavior: 'smooth' });
        }
    };

    const handleScrollRight = (ref: React.RefObject<HTMLDivElement>) => {
        if (ref.current) {
            ref.current.scrollBy({ left: 300, behavior: 'smooth' });
        }
    };

    return (
        <div className="carousel-container">
            <Button variant="light" className="carousel-control left" onClick={() => handleScrollLeft(carouselRef)}>
                <i className="bi bi-chevron-compact-left" style={{marginLeft: '2px'}}></i>
            </Button>

            <div className="carousel-items" style={{width: `${width}rem`}} ref={carouselRef}>
                {books.map((book: Book, index: number) => (
                    <Card key={index} className="book-card">
                        {book.coverUrl && (
                            <Card.Img
                                variant="top"
                                src={book.coverUrl}
                                alt={book.title}
                                className="book-thumbnail"
                            />
                        )}
                        <Card.Body style={{maxWidth: '210px'}}>
                            <Card.Title className="book-title">
                                <Card.Title>
                                    <Link to={`/books/${book.gbId}`}
                                          className="book-title"
                                          style={{textDecoration: 'none', color: 'inherit'}}>
                                        {book.title || 'Название неизвестно'}
                                    </Link>
                                </Card.Title>
                            </Card.Title>
                            <Card.Text className="book-author">
                                {book.authors?.map(author => (
                                    <a style={{textDecoration: 'none', color: 'inherit', cursor: 'pointer'}}
                                       key={author.id}>{author.name}</a>)) || 'Автор неизвестен'}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                ))}
            </div>

            <Button variant="light" className="carousel-control right" onClick={() => handleScrollRight(carouselRef)}>
                <i className="bi bi-chevron-compact-right" style={{marginLeft: '2px'}}></i>
            </Button>
        </div>
    );
};

export default BooksListCarousel;

