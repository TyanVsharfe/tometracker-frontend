import React, {useEffect, useRef, useState} from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import AccountNav from "../../components/AccountNav.tsx";
import { getAllBooksInfo, UserInfo } from "../../services/userBookService.ts";
import { getStatusTranslation } from "../../utils/Enums.ts";
import CustomBarChart from "../../components/charts/CustomBarChart.tsx";
import CustomPieChart from "../../components/charts/CustomPieChart.tsx";
import ReadingGoals from "../../components/ReadingGoals.tsx";
import {Alert, Spinner} from "react-bootstrap";
import BookListCarousel from "../../components/BookListCarousel.tsx";
import {getRecommendationsForUser} from "../../services/recommendationService.ts";

function UserInfoPage() {
    const [userInfo, setUserInfo] = useState<UserInfo>();
    const [books, setBooks] = useState<Book>([]);
    const [activeStatusView, setActiveStatusView] = useState("bar");
    const [activeGenreView, setActiveGenreView] = useState("pie");
    const [activeTab, setActiveTab] = useState("statistics");

    const recommendationCarouselRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const data = await getAllBooksInfo();
                const books = await getRecommendationsForUser();
                setUserInfo(data);
                setBooks(books);
            } catch (error) {
                console.error("Error fetching user info:", error);
            }
        };

        fetchUserInfo();
    }, []);

    const getStatusData = () => {
        if (!userInfo?.userBookQuantity) return [];
        return userInfo.userBookQuantity.map((item) => ({
            ...item,
            category: getStatusTranslation(item.category),
        }));
    };

    const getTotalBooks = () => {
        if (!userInfo?.allBookQuantity) return 0;
        return userInfo.allBookQuantity;
    };

    const getReadBooks = () => {
        if (!userInfo?.userBookQuantity) return 0;
        const readStatus = userInfo.userBookQuantity.find(item => item.category === "Completed");
        return readStatus ? readStatus.count : 0;
    };

    const renderBookCarousel = (loading: boolean, carouselRef: React.RefObject<HTMLDivElement>) => {
        if (loading) {
            return (
                <Container style={{ display: "flex", justifyContent: "center", paddingBottom: '20px' }}>
                    <Spinner animation="border" variant="primary" />
                </Container>
            );
        }

        if (!books || books.length === 0) {
            return (
                <Container style={{ textAlign: "center", maxWidth: "500px" }}>
                    <Alert>Книги не найдены</Alert>
                </Container>
            );
        }

        return (
            <BookListCarousel books={books} carouselRef={carouselRef} width={65}/>
        );
    };

    return (
        <Container style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
            <AccountNav />

            <Tab.Container id="user-tabs" defaultActiveKey="statistics" onSelect={(k) => setActiveTab(k)}>
                <Row className="mt-4" style={{display: "flex", justifyContent: "center"}}>
                    <Col lg={4} className="mb-4" style={{ display: "flex", justifyContent: "center", marginRight: "15px"  }}>
                        <Card className="shadow-sm" style={{ width: "90rem"}}>
                            <Card.Body className="text-center">
                                <div className="mb-3">
                                    <div style={{
                                        width: "80px",
                                        height: "80px",
                                        borderRadius: "50%",
                                        backgroundColor: "#8884d8",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "white",
                                        fontSize: "24px",
                                        margin: "0 auto 15px"
                                    }}>
                                        {userInfo?.username?.charAt(0).toUpperCase()}
                                    </div>
                                    <h3>{userInfo?.username}</h3>
                                    <Badge bg={userInfo?.subscription === "Premium" ? "success" : "secondary"}
                                           className="px-3 py-2">
                                        {userInfo?.subscription}
                                    </Badge>
                                </div>

                                <div style={{
                                    display: "flex",
                                    justifyContent: "space-around",
                                    textAlign: "center",
                                    marginTop: "24px"
                                }}>
                                    <div>
                                        <h5>Всего книг</h5>
                                        <div style={{ fontSize: "24px", fontWeight: "bold" }}>
                                            {getTotalBooks()}
                                        </div>
                                    </div>
                                    <div>
                                        <h5>Жанров</h5>
                                        <div style={{ fontSize: "24px", fontWeight: "bold" }}>
                                            {userInfo?.bookCountByGenre?.length || 0}
                                        </div>
                                    </div>
                                    <div>
                                        <h5>Прочитано</h5>
                                        <div style={{ fontSize: "24px", fontWeight: "bold" }}>
                                            {getReadBooks()}
                                        </div>
                                    </div>
                                </div>
                            </Card.Body>

                            <Card.Footer className="bg-white">
                                <Nav variant="pills" className="flex-column">
                                    <Nav.Item>
                                        <Nav.Link eventKey="statistics">Статистика</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="recommendations">Рекомендации</Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </Card.Footer>
                        </Card>
                    </Col>

                    <Col style={{display: 'contents'}}>
                        <Tab.Content>
                            <Tab.Pane eventKey="statistics">
                                <Row style={{ width: "75rem", height: "35rem"}}>
                                    <Col md={12} lg={6} className="mb-4">
                                        <Card className="h-100 shadow-sm">
                                            <Card.Header className="bg-white d-flex justify-content-between align-items-center">
                                                <h5 className="mb-0">Книги по статусам</h5>
                                                <ButtonGroup size="sm">
                                                    <Button
                                                        variant={activeStatusView === "bar" ? "primary" : "outline-primary"}
                                                        onClick={() => setActiveStatusView("bar")}
                                                    >
                                                        Столбцы
                                                    </Button>
                                                    <Button
                                                        variant={activeStatusView === "pie" ? "primary" : "outline-primary"}
                                                        onClick={() => setActiveStatusView("pie")}
                                                    >
                                                        Круг
                                                    </Button>
                                                </ButtonGroup>
                                            </Card.Header>
                                            <Card.Body>
                                                {userInfo && (activeStatusView === "bar"
                                                        ? <CustomBarChart data={getStatusData()} nameKey="category" />
                                                        : <CustomPieChart data={getStatusData()} nameKey="category" />
                                                )}
                                            </Card.Body>
                                        </Card>
                                    </Col>

                                    <Col md={12} lg={6} className="mb-4">
                                        <Card className="h-100 shadow-sm">
                                            <Card.Header className="bg-white d-flex justify-content-between align-items-center">
                                                <h5 className="mb-0">Распределение по жанрам</h5>
                                                <ButtonGroup size="sm">
                                                    <Button
                                                        variant={activeGenreView === "pie" ? "primary" : "outline-primary"}
                                                        onClick={() => setActiveGenreView("pie")}
                                                    >
                                                        Круг
                                                    </Button>
                                                    <Button
                                                        variant={activeGenreView === "bar" ? "primary" : "outline-primary"}
                                                        onClick={() => setActiveGenreView("bar")}
                                                    >
                                                        Столбцы
                                                    </Button>
                                                </ButtonGroup>
                                            </Card.Header>
                                            <Card.Body>
                                                {userInfo && (activeGenreView === "pie"
                                                        ? <CustomPieChart data={userInfo.bookCountByGenre || []} nameKey="genre" />
                                                        : <CustomBarChart data={userInfo.bookCountByGenre || []} nameKey="genre" />
                                                )}
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>
                            </Tab.Pane>

                            <Tab.Pane eventKey="recommendations">
                                <Card className="shadow-sm">
                                    <Card.Header className="bg-white">
                                        <h5 className="mb-0">Рекомендации для вас</h5>
                                    </Card.Header>
                                    <Card.Body>
                                        {/*<p className="text-muted">*/}
                                        {/*    Здесь будут отображаться персонализированные рекомендации книг на основе ваших предпочтений,*/}
                                        {/*    истории чтения и интересов.*/}
                                        {/*</p>*/}

                                        {/*<div style={{ marginTop: "15px" }}>*/}
                                        {/*    <h6>Что можно добавить в этот раздел:</h6>*/}
                                        {/*    <ul>*/}
                                        {/*        <li>Рекомендации на основе часто читаемых жанров</li>*/}
                                        {/*        <li>Книги, популярные среди пользователей с похожими интересами</li>*/}
                                        {/*        <li>Новинки в ваших любимых жанрах</li>*/}
                                        {/*        <li>Книги того же автора, что вы уже читали</li>*/}
                                        {/*    </ul>*/}
                                        {/*</div>*/}
                                        <>
                                            {renderBookCarousel(false, recommendationCarouselRef)}
                                        </>
                                    </Card.Body>
                                </Card>
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                </Row>
                <ReadingGoals />
            </Tab.Container>
        </Container>
    );
}

export default UserInfoPage;