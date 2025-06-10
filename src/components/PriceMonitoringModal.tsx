import React, { useState, useEffect } from 'react';
import {Modal, Button, Form, Container, Alert} from 'react-bootstrap';
import {UserBook} from "../services/userBookService.ts";
import {createSubscription} from "../services/bookPriceSubscriptionService.ts";

interface PriceMonitoringModalProps {
    show: boolean;
    onHide: () => void;
    currentPrice: number;
    targetPrice: number;
    bookId: string;
    bookUrl: string
    storeName: string
}

const PriceMonitoringModal: React.FC<PriceMonitoringModalProps> = ({show, onHide, currentPrice, targetPrice, bookId, bookUrl, storeName}) => {
    const [targPrice, setTargPrice] = useState(targetPrice);
    const [priceDifference, setPriceDifference] = useState(0);
    const [percentageDifference, setPercentageDifference] = useState(0);

    const targetPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTargetPrice = parseFloat(e.target.value);
        setTargPrice(newTargetPrice);
    };

    useEffect(() => {
        const difference = targPrice - currentPrice;
        setPriceDifference(difference);
        setPercentageDifference(((difference / currentPrice) * 100));
    }, [targPrice, currentPrice]);

    const differenceMessage = priceDifference > 0
        ? `Целевая цена выше текущей на ${priceDifference}₽ (${percentageDifference.toFixed(2)}%)`
        : priceDifference < 0
            ? `Целевая цена ниже текущей на ${Math.abs(priceDifference).toFixed(2)}₽ (${Math.abs(percentageDifference).toFixed(2)}%)`
            : `Целевая цена равна текущей`;

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Мониторинг цены на книгу</Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-dialog-scrollable">
                <Container style={{ maxHeight: '30rem' }}>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Текущая цена</Form.Label>
                            <Form.Control
                                type="text"
                                value={currentPrice.toFixed(2)}
                                readOnly
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Целевая цена</Form.Label>
                            <Form.Control
                                type="number"
                                value={targPrice}
                                onChange={targetPriceChange}
                                min="1"
                                required
                            />
                        </Form.Group>

                        <Alert variant={priceDifference < 0 ? 'success' : priceDifference == 0 ? 'info' : 'danger'}>
                            {differenceMessage}
                            {priceDifference > 0 ? <i className="bi bi-arrow-up" style={{padding: "10px"}}/> :
                                priceDifference == 0 ? '' : <i className="bi bi-arrow-down" style={{padding: "10px"}}/>
                            }
                        </Alert>
                    </Form>
                </Container>
            </Modal.Body>
            <Modal.Footer style={{justifyContent: "space-between"}}>
                <Button variant="outline-danger" onClick={onHide}>
                    Отменить подписку
                </Button>
                <div style={{display: 'flex', justifyContent: 'space-between', width:'17rem'}}>
                    <Button variant="secondary" onClick={onHide}>
                        Закрыть
                    </Button>
                    <Button variant="primary" onClick={() => {
                        createSubscription(bookId, bookUrl, storeName, targPrice);
                        onHide();
                    }}>
                        Обновить подписку
                    </Button>
                </div>
            </Modal.Footer>
        </Modal>
    );
};

export default PriceMonitoringModal;
