import React, { useEffect, useState, useRef } from 'react';
import { Container, Spinner, Stack, Alert, Button } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import { gBook, getBookRecommendationByGenre } from '../../services/bookService.ts';
import {Link, useNavigate} from 'react-router-dom';
import '../style/home-page.css';
import {Book} from "../../services/userBookService.ts";

const HomePage: React.FC = () => {
    const [scifiData, setScifiData] = useState<any>(null);
    const [fantasyData, setFantasyData] = useState<any>(null);
    const [scifiLoading, setScifiLoading] = useState(true);
    const [fantasyLoading, setFantasyLoading] = useState(true);

    const navigate = useNavigate();
    const scifiCarouselRef = useRef<HTMLDivElement>(null);
    const fantasyCarouselRef = useRef<HTMLDivElement>(null);

    const logDataStructure = (data: any, genre: string) => {
        console.log(`--- ${genre} data structure ---`);
        console.log('Raw data:', data);
        if (data && typeof data === 'object') {
            console.log('Keys:', Object.keys(data));
        }
    };

    useEffect(() => {
        console.log('Fetching data from API...');

        getBookRecommendationByGenre('Science Fiction')
            .then(results => {
                console.log('Science Fiction API response:', results);
                logDataStructure(results, 'Science Fiction');
                setScifiData(results);
                setScifiLoading(false);
            })
            .catch(error => {
                console.error('Error fetching Science Fiction books:', error);
                setScifiLoading(false);
            });

        getBookRecommendationByGenre('Fantasy')
            .then(results => {
                console.log('Fantasy API response:', results);
                logDataStructure(results, 'Fantasy');
                setFantasyData(results);
                setFantasyLoading(false);
            })
            .catch(error => {
                console.error('Error fetching Fantasy books:', error);
                setFantasyLoading(false);
            });
    }, []);

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

    const navigateToRecommendationPage = (genre: string, data: any) => {
        navigate(`/recommendations/${genre}`, {
            state: {
                books: getBookItemsFromData(data),
                genre: genre
            }
        });
    };

    // Функция для безопасного извлечения книг из данных API
    const getBookItemsFromData = (data: any): Book[] => {
        if (!data) return [];

        // Если вернулся массив напрямую
        if (Array.isArray(data)) return data;

        // Если structure.items
        if (data.items && Array.isArray(data.items)) return data.items;

        // Если данные в другой структуре - проверяем все ключи верхнего уровня
        for (const key in data) {
            if (Array.isArray(data[key])) {
                return data[key];
            }

            // Проверка вложенных объектов
            if (typeof data[key] === 'object' && data[key] !== null) {
                for (const nestedKey in data[key]) {
                    if (Array.isArray(data[key][nestedKey])) {
                        return data[key][nestedKey];
                    }
                }
            }
        }

        console.error('Could not find books array in data:', data);
        return [];
    };

    const renderBookCarousel = (data: any, loading: boolean, genre: string, carouselRef: React.RefObject<HTMLDivElement>) => {
        if (loading) {
            return (
                <Container style={{ display: "flex", justifyContent: "center", paddingBottom: '20px' }}>
                    <Spinner animation="border" variant="primary" />
                </Container>
            );
        }

        const books = getBookItemsFromData(data);

        console.log(`${genre} books extracted:`, books);

        if (!books || books.length === 0) {
            return (
                <Container style={{ textAlign: "center", maxWidth: "500px" }}>
                    <Alert>Книги не найдены для жанра {genre === 'Science Fiction' ? 'Научная фантастика' : 'Фэнтези'}</Alert>
                </Container>
            );
        }

        return (
            <div className="carousel-container">
                <Button variant="light" className="carousel-control left" onClick={() => handleScrollLeft(carouselRef)}>
                    <i className="bi bi-chevron-compact-left" style={{ marginLeft: '2px' }}></i>
                </Button>

                <div className="carousel-items" ref={carouselRef}>
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
                    <i className="bi bi-chevron-compact-right" style={{ marginLeft: '2px' }}></i>
                </Button>
            </div>
        );
    };

    return (
        <Container>
            <Stack className="d-flex justify-content-center align-items-center">
                {/* Science Fiction Section */}
                <div className="genre-section">
                    <div className="genre-header">
                        <h2 className="page-title">Книги по жанру Научная фантастика</h2>
                        <Button
                            variant="primary"
                            onClick={() => navigateToRecommendationPage('Science Fiction', scifiData)}
                            className="see-more-btn"
                            disabled={scifiLoading || !scifiData}
                        >
                            Подробнее
                        </Button>
                    </div>

                    {renderBookCarousel(scifiData, scifiLoading, 'Science Fiction', scifiCarouselRef)}
                </div>

                {/* Fantasy Section */}
                <div className="genre-section">
                    <div className="genre-header">
                        <h2 className="page-title">Книги по жанру Фэнтези</h2>
                        <Button
                            variant="primary"
                            onClick={() => navigateToRecommendationPage('Fantasy', fantasyData)}
                            className="see-more-btn"
                            disabled={fantasyLoading || !fantasyData}
                        >
                            Подробнее
                        </Button>
                    </div>

                    {renderBookCarousel(fantasyData, fantasyLoading, 'Fantasy', fantasyCarouselRef)}
                </div>
            </Stack>
        </Container>
    );
};

export default HomePage;