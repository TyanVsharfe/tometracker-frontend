import Container from "react-bootstrap/Container";
import {Button, ButtonGroup, Card, Col, ProgressBar, Row, Stack} from "react-bootstrap";

import "../style/style.css"
import "../style/book-card.css"
import AccountNav from "../../components/AccountNav.tsx";
import React, {useEffect, useState} from "react";
import {getUserAchievements, UserAchievment} from "../../services/achievementService.ts";
import {Book} from "../../services/userBookService.ts";
import {format, parseISO} from "date-fns";
import {ru} from "date-fns/locale";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

function UserAchievements() {
    const [userAchievments, setUserAchievments] = useState<UserAchievment[]>();

    useEffect(() => {
        const userAchievments = getUserAchievements();
        userAchievments.then((data: UserAchievment[]) => {
            setUserAchievments(data)
            console.log(data)
        })
    }, []);

    const formatDate = (dateString: string) => {
        try {
            return format(parseISO(dateString), "d MMMM yyyy", { locale: ru });
        } catch (e) {
            return dateString;
        }
    };

    return (
        <Container style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
            <AccountNav/>
            <Row className="mt-4">
                {userAchievments?.map((userAchievment) => {
                    const { name, requiredCount, iconUrl, description, id } = userAchievment.achievement;
                    const { currentProgress, achievedAt } = userAchievment;
                    const percentage = Math.min(Math.round((currentProgress / requiredCount) * 100), 100);

                    return (
                        <Col key={id} xs={12} sm={6} md={4} lg={3} className="mb-4 d-flex justify-content-center">
                            <Card style={{ width: "100%", maxWidth: "250px", textAlign: "center", padding: "10px" }}>
                                {/*{iconUrl && <Card.Img variant="top" src={iconUrl} style={{ maxHeight: "80px", objectFit: "contain" }} />}*/}
                                <Card.Body>
                                    <Card.Title id="card-title" style={{
                                        fontSize: "1.1rem",
                                        fontWeight: "bold",
                                        height: "3rem",
                                    }}>
                                        <OverlayTrigger
                                            placement="bottom"
                                            overlay={<Tooltip id={`tooltip-${id}`}>{description}</Tooltip>}
                                            container={document.body}
                                        >
                                            <span style={{ cursor: 'pointer' }}>{name}</span>
                                        </OverlayTrigger>
                                    </Card.Title>
                                    {achievedAt ? (
                                        <div style={{fontSize: "0.9rem", color: "#666", padding: "0.5rem", paddingTop: "0", height: "2rem"}}>
                                            Получено: {formatDate(achievedAt)}
                                        </div>)
                                        : (<div style={{padding: "0.5rem", paddingTop: "0", height: "2rem"}}></div>)}
                                    <ProgressBar
                                        now={percentage}
                                        // label={`${percentage}%`}
                                        style={{height: "1rem", marginBottom: "10px"}}
                                    />
                                    <div style={{fontSize: "0.9rem", color: "#666"}}>
                                        {currentProgress > requiredCount ? (`${requiredCount} / ${requiredCount}`) : (`${currentProgress} / ${requiredCount}`)}
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    );
                })}
            </Row>
        </Container>
    );
}

export default UserAchievements;