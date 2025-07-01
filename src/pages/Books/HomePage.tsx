import React, { useEffect, useState, useRef } from 'react';
import { Container, Spinner, Stack, Alert, Button } from 'react-bootstrap';
import {Link, useNavigate} from 'react-router-dom';
import '../styles/home-page.css';
import {Book} from "../../services/userBookService.ts";
import BookListCarousel from "../../components/BookListCarousel.tsx";
import {getBookRecommendationByGenre, getPopulars} from "../../services/recommendationService.ts";
import { shuffle } from 'radash';

const HomePage: React.FC = () => {
    const [scifiData, setScifiData] = useState<any>(null);
    const [fantasyData, setFantasyData] = useState<any>(null);
    const [popularsData, setPopularsData] = useState<any>(null);
    const [scifiLoading, setScifiLoading] = useState(true);
    const [fantasyLoading, setFantasyLoading] = useState(true);
    const [popularsLoading, setPopularsLoading] = useState(true);

    const navigate = useNavigate();
    const scifiCarouselRef = useRef<HTMLDivElement>(null);
    const fantasyCarouselRef = useRef<HTMLDivElement>(null);
    const popularsCarouselRef = useRef<HTMLDivElement>(null);

    const logDataStructure = (data: any, genre: string) => {
        console.log(`--- ${genre} data structure ---`);
        console.log('Raw data:', data);
        if (data && typeof data === 'object') {
            console.log('Keys:', Object.keys(data));
        }
    };

    useEffect(() => {
        console.log('Fetching data from API...');

        getPopulars()
            .then(results => {
                setPopularsData(results);
                setPopularsLoading(false);
            })

        getBookRecommendationByGenre('Science Fiction')
            .then(results => {
                const shuffledData = shuffle(results);
                console.log('Science Fiction API response:', results);
                logDataStructure(results, 'Science Fiction');
                setScifiData(shuffledData);
                setScifiLoading(false);
            })
            .catch(error => {
                console.error('Error fetching Science Fiction books:', error);
                setScifiLoading(false);
            });

        getBookRecommendationByGenre('Fantasy')
            .then(results => {
                const shuffledData = shuffle(results);
                console.log('Fantasy API response:', results);
                logDataStructure(results, 'Fantasy');
                setFantasyData(shuffledData);
                setFantasyLoading(false);
            })
            .catch(error => {
                console.error('Error fetching Fantasy books:', error);
                setFantasyLoading(false);
            });
    }, []);

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
            <BookListCarousel books={books} carouselRef={carouselRef} />
        );
    };

    return (
        <Container>
            <Stack className="d-flex justify-content-center align-items-center">
                {/* Populars Section */}
                <div className="genre-section">
                    <div className="genre-header">
                        <h2 className="page-title">Популярное среди пользователей</h2>
                        <Button
                            variant="primary"
                            onClick={() => navigateToRecommendationPage('Science Fiction', scifiData)}
                            className="see-more-btn"
                            disabled={popularsLoading || !popularsData}
                        >
                            Подробнее
                        </Button>
                    </div>

                    {renderBookCarousel(popularsData, popularsLoading, 'Science Fiction', popularsCarouselRef)}
                </div>

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