import Container from "react-bootstrap/Container";
import {ButtonGroup, Stack} from "react-bootstrap";

import "../style/style.css"
import "../style/book-card.css"
import AccountNav from "../../components/AccountNav.tsx";
import React, {useEffect, useState} from "react";
import {getAllBooksInfo, UserInfo} from "../../services/userBookService.ts";
import UserBooksBarChart from "../../components/charts/UserBooksBar.tsx";
import PieChartWithCustomizedLabel from "../../components/charts/PieChartWithCustomizedLabel.tsx";
import Button from "react-bootstrap/Button";

function UserInfoPage() {
    const [userInfo, setUserInfo] = useState<UserInfo>();
    const [barMode, setBarMode] = useState<number>(0);
    const [pieMode, setPieMode] = useState<number>(0);

    useEffect(() => {
        const userInfo = getAllBooksInfo();
        userInfo.then((data: UserInfo) => {
            setUserInfo(data)
            console.log(data)
        })
    }, []);

    return (
        <Container style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
            <AccountNav/>

            <Container>
                <Stack className=".d-flex justify-content-center align-items-center" style={{marginBottom: "40px"}}>
                    {/*<h1 style={{fontSize: "32px", marginBottom: "10px"}}>Информация</h1>*/}
                    <p style={{fontSize: "20px", marginBottom: "5px"}}><strong>Имя пользователя:</strong></p>
                    <p style={{fontSize: "24px"}}>{userInfo?.username}</p>

                    <p style={{fontSize: "20px", marginBottom: "5px"}}><strong>Тип подписки:</strong></p>
                    <p style={{fontSize: "24px"}}>{userInfo?.subscription}</p>
                </Stack>
                {/*<Stack>*/}
                {/*    {userInfo?.userBookQuantity.map((book) => (*/}
                {/*        <Container style={{textAlign: 'center'}}>{book.category} {book.bookQuantity}</Container>*/}
                {/*    ))}*/}
                {/*</Stack>*/}
            </Container>
            <Container style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                paddingBottom: "70px"
            }}>
                <h2 style={{alignItems: 'center', textAlign: 'center'}}>Количество книг по статусам:</h2>
                <ButtonGroup style={{margin: "20px"}}>
                    <Button onClick={() => {
                        setBarMode(0)
                    }}>Столбчатая диаграмма</Button>
                    <Button onClick={() => {
                        setBarMode(1)
                    }}>Круговая диаграмма</Button>
                </ButtonGroup>
                {userInfo && (barMode == 0 ? <UserBooksBarChart
                        userBookQuantity={userInfo.userBookQuantity} genreQuantity={userInfo.bookCountByGenre}
                        mode={barMode}/> :
                    <PieChartWithCustomizedLabel
                        userBookQuantity={userInfo.userBookQuantity} genreQuantity={userInfo.bookCountByGenre}
                        mode={barMode}/>)}
            </Container>
            <Container style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
                <h2 style={{textAlign: 'center'}}>Распределение по жанрам:</h2>
                <ButtonGroup style={{margin: "20px"}}>
                    <Button onClick={() => {
                        setPieMode(0)
                    }}>Круговая диаграмма</Button>
                    <Button onClick={() => {
                        setPieMode(1)
                    }}>Столбчатая диаграмма</Button>
                </ButtonGroup>
                {userInfo && (pieMode == 0 ?  <PieChartWithCustomizedLabel
                    userBookQuantity={userInfo.userBookQuantity} genreQuantity={userInfo.bookCountByGenre} mode={pieMode}/> :
                    <UserBooksBarChart
                        userBookQuantity={userInfo.userBookQuantity} genreQuantity={userInfo.bookCountByGenre} mode={pieMode} />)}
            </Container>
        </Container>
    );
}

export default UserInfoPage;