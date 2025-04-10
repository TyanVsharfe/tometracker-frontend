import React from 'react';
import { Container, Row, Col, Card, Button, ListGroup, Badge } from 'react-bootstrap';

const SubscriptionPlans = () => {
    return (
        <Container style={{width: '50rem'}}>
            {/*<h2 className="mb-3 text-muted">Tracker</h2>*/}
            {/*<p className="text-secondary">Connect an active Boosty account to receive your in-site perks.</p>*/}
            {/*<Button variant="danger" className="mb-4">Connect Boosty account</Button>*/}
            {/*<p className="text-muted">Not on Boosty? Check out all these cool perks you can get by signing up!</p>*/}

            <h2 className="mb-3" style={{textAlign: "center"}}>Виды подписки</h2>
            <Row className="mt-4">
                {/* Free Plan */}
                <Col md={6} className="mb-4">
                    <Card className="shadow-sm border-primary">
                        <Card.Header className="text-center fw-bold bg-white border-primary">Бесплатная</Card.Header>
                        <ListGroup variant="flush">
                            <ListGroup.Item>Неограниченный учет книг</ListGroup.Item>
                            <ListGroup.Item>Неограниченные отзывы о книгах</ListGroup.Item>
                            <ListGroup.Item>Неограниченный мониторинг цен</ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>

                {/* Tracker Plan */}
                <Col md={6} className="mb-4">
                    <Card className="shadow-sm border-danger">
                        <Card.Header className="text-center fw-bold bg-white border-danger"> Платная
                            (Tracker)</Card.Header>
                        <ListGroup variant="flush">
                            <ListGroup.Item>📊 Персонализированная страница статистики <strong>за все
                                время</strong></ListGroup.Item>
                            <ListGroup.Item>✨ Отображение статуса <Badge bg="danger">TRACKER</Badge> рядом с вашим
                                именем пользователя </ListGroup.Item>
                            <ListGroup.Item>🧼 Отсутствие рекламы</ListGroup.Item>
                            <ListGroup.Item className="fst-italic">Еще больше функций в дальнейшем!</ListGroup.Item>
                        </ListGroup>
                        <Card.Footer className="bg-white text-center">
                            <Button variant="danger">150₽ / месяц на Boosty</Button>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default SubscriptionPlans;
