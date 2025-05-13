import React, {useEffect, useState} from 'react';
import Container from "react-bootstrap/Container";
import {Alert, Spinner, Stack} from "react-bootstrap";
import {gBook, getBookRecommendationByGenre} from "../../services/bookService.ts";
import BookList from "../../components/BookList.tsx";

const RecommendationPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [searchResults, setSearchResults] = useState<gBook[]>([]);

    const [searchTerm, setsearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const searchQuery = searchParams.get("q");

        setsearchTerm(searchQuery || "");
        console.log("search query:", searchQuery);

        if (searchQuery != null && searchQuery != "") {
            setIsLoading(true);
            getBookRecommendationByGenre(searchQuery).then(results => {
                //localStorage.setItem('book_list', JSON.stringify(results));
                setSearchResults([]);
                console.log(results);
                setSearchResults(results);
                setIsLoading(false);
            });
        }
    }, [searchParams]);

    const renderSearchResults = () => {
        const booksResults = searchResults.items;

        if (Array.isArray(booksResults)) {
            return (
                <BookList books={booksResults} booksPerPage={18}/>
            )
        }
        else {
            return (
                <Container style={{textAlign: "center", maxWidth: "500px"}}>
                    <Alert>Books not found</Alert>
                </Container>
            )
        }
    };

    return (
        <Container>
            <Stack className=".d-flex justify-content-center align-items-center">
                <h2 className='page-title'>Подборка книг по жанру {searchTerm}</h2>
                <Container style={{ textAlign: "center", width: '35rem', paddingBottom: "10px" }}>
                </Container>
                {isLoading ? (
                    <Container style={{display: "flex", justifyContent: "center", paddingBottom: '20px'}}>
                        <Spinner animation="border" variant="primary" />
                    </Container>
                ) : (
                    <Container className="justify-content-start align-items-center books-list">
                        {renderSearchResults()}
                    </Container>
                )}
            </Stack>
        </Container>
    );
}


export default RecommendationPage;

