import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { ReactComponent as Logout } from '../assets/logout.svg';
import { ReactComponent as Bell } from '../assets/bell-fill.svg';
import "../pages/styles/nav.css"

import "bootstrap-icons/font/bootstrap-icons.css";

import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../store/store.ts";
import {logout} from "../store/authSlice.ts";
import Badge from "react-bootstrap/Badge";
import Modal from "react-bootstrap/Modal";
import {ListGroup} from "react-bootstrap";
import {
    deleteNotification,
    getNotifications,
    markAllNotificationAsRead, markNotificationAsRead,
    PriceNotification
} from "../services/notificationService.ts";
import {formatDistanceToNow} from "date-fns";
import { ru } from 'date-fns/locale';

const Navigation: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isLogin = useSelector((state: RootState) => state.auth.isLogin)
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState<PriceNotification[]>([]);

    useEffect(() => {
        if (isLogin) {
            getNotifications().then(data => setNotifications(data));
        }
    }, [isLogin]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    };

    const handleLogout = () => {
        dispatch(logout() as any).then(() => navigate('/login'));
    };

    const handleBellClick = () => {
        setShowNotifications(true);
    };

    const handleCloseNotifications = () => {
        setShowNotifications(false);
    };

    const markAsRead = (id: number) => {
        setNotifications(prev =>
            prev.map(notification =>
                notification.id === id
                    ? { ...notification, isRead: true }
                    : notification
            )
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev =>
            prev.map(notification => ({ ...notification, isRead: true }))
        );
    };

    const deleteNotificationById = (id: number) => {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
    };

    const getUserTimezoneOffset = () => {
        const now = new Date();
        return now.getTimezoneOffset() * 60 * 1000;
    };

    const formatTimestamp = (timestamp: string) => {
        const utcDate = new Date(timestamp);

        const timezoneOffset = getUserTimezoneOffset();

        const localDate = new Date(utcDate.getTime() + timezoneOffset);

        return formatDistanceToNow(localDate, {
            addSuffix: true,
            locale: ru
        });
    };

    const getNotificationVariant = (type?: string) => {
        switch (type) {
            case 'success': return 'success';
            case 'warning': return 'warning';
            case 'error': return 'danger';
            default: return 'info';
        }
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <>
            <Navbar style={{width:'100%'}} data-bs-theme="dark" expand="lg" className="bg-body-tertiary">
                <Container>
                    <Navbar.Brand href="/main"><h1>tometracker</h1></Navbar.Brand>
                    <Navbar id="basic-navbar-nav">
                        <Nav className="container-fluid">
                            <Nav.Link className='nav__link' href="/main">Главная</Nav.Link>
                            <Nav.Link className='nav__link' href="/search" style={{textAlign: 'center'}}>Поиск</Nav.Link>
                            {isLogin ? (
                                <Nav.Link className='nav__link' href="/account/books">Аккаунт</Nav.Link>
                            ) : (
                                <Nav.Link className='nav__link' href="/login">Войти</Nav.Link>
                            )}
                            {/*<Nav.Link href="/search"><i className="bi bi-search" styles={{fontSize: '2rem'}}></i></Nav.Link>
                        <Nav.Link href="/account"><i className="bi bi-person-circle" styles={{fontSize: '2rem'}}></i></Nav.Link>*/}
                            <button
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    background: 'transparent',
                                    border: 'none',
                                    padding: '0px 10px',
                                    borderRadius: '5px',
                                    position: 'relative'
                                }}
                                onClick={handleBellClick}
                            >
                                <Bell style={{width: '1.3rem', height: '1.3rem'}}/>
                                {unreadCount > 0 && (
                                    <Badge
                                        bg="danger"
                                        style={{
                                            position: 'absolute',
                                            top: '-8px',
                                            right: '4px',
                                            fontSize: '0.7rem',
                                            minWidth: '18px',
                                            height: '18px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        {unreadCount}
                                    </Badge>
                                )}
                            </button>
                            <Form onSubmit={handleSubmit} style={{paddingLeft: '5px'}}>
                                <Row>
                                    <Col xs="auto">
                                        <Form.Control
                                            type="text"
                                            placeholder="поиск"
                                            className=" mr-sm-2"
                                            id={"gameNameInput"}
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </Col>
                                    {/*<Col xs="auto">*/}
                                    {/*    <Button type="submit" id={"submitButton"}>искать</Button>*/}
                                    {/*</Col>*/}
                                </Row>
                            </Form>
                            {isLogin ? (
                                <button style={{
                                    display: 'flex', justifyContent: 'center',
                                    alignItems: 'center', background: 'transparent', border: 'none'
                                }} onClick={handleLogout}><Logout/></button>
                            ) : (
                                <div style={{width: '36px', height: '26px'}}></div>
                            )}
                        </Nav>
                    </Navbar>
                </Container>
            </Navbar>

            <Modal
                show={showNotifications}
                onHide={handleCloseNotifications}
                size="lg"
                aria-labelledby="notifications-modal-title"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="notifications-modal-title">
                        Уведомления
                        {unreadCount > 0 && (
                            <Badge bg="primary" className="ms-2">
                                {unreadCount} новых
                            </Badge>
                        )}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {notifications.length === 0 ? (
                        <div className="text-center text-muted p-4">
                            <i className="bi bi-bell-slash" style={{ fontSize: '3rem' }}></i>
                            <p className="mt-3">Уведомлений нет</p>
                        </div>
                    ) : (
                        <ListGroup variant="flush">
                            {notifications.map((notification) => (
                                <ListGroup.Item
                                    key={notification.id}
                                    style={{
                                        backgroundColor: !notification.isRead ? '#f8f9fa' : 'transparent',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => {
                                        markAsRead(notification.id)
                                        markNotificationAsRead(notification.id)
                                    }}
                                >
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div className="flex-grow-1">
                                            <div className="d-flex align-items-center mb-1">
                                                <h6 className="mb-0 me-2">Мониторинг</h6>
                                                {!notification.isRead && (
                                                    <Badge bg="primary" className="ms-auto">Новое</Badge>
                                                )}
                                            </div>
                                            <p className="mb-1 text-muted">{notification.message}</p>
                                            <small className="text-muted">
                                                {formatTimestamp(notification.createdAt)}
                                            </small>
                                        </div>
                                        <button
                                            className="btn btn-outline-danger btn-sm ms-2"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteNotificationById(notification.id);
                                                deleteNotification(notification.id);
                                            }}
                                            title="Удалить уведомление"
                                            style={{alignSelf: 'flex-start'}}
                                        >
                                            <i className="bi bi-x"></i>
                                        </button>
                                    </div>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                </Modal.Body>
                {notifications.length > 0 && (
                    <Modal.Footer>
                        <Button
                            variant="outline-primary"
                            onClick={() => {
                                markAllAsRead();
                                markAllNotificationAsRead();
                            }}
                            disabled={unreadCount === 0}
                        >
                            Отметить все как прочитанные
                        </Button>
                        <Button variant="primary" onClick={handleCloseNotifications}>
                            Закрыть
                        </Button>
                    </Modal.Footer>
                )}
            </Modal>
        </>
    );
}

export default React.memo(Navigation);