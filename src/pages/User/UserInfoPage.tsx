import Container from "react-bootstrap/Container";
import { Stack} from "react-bootstrap";

import "../style/style.css"
import "../style/book-card.css"
import AccountNav from "../../components/AccountNav.tsx";
import React, {useEffect, useState} from "react";
import {getAllBooksInfo, UserInfo} from "../../services/userBookService.ts";
import UserBooksBarChart from "../../components/UserBooksBar.tsx";

function UserInfoPage() {
    const [userInfo, setUserInfo] = useState<UserInfo>();

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
            {userInfo && <UserBooksBarChart userBookQuantity={userInfo.userBookQuantity} />}
        </Container>
    );
}

export default UserInfoPage;