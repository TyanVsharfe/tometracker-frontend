import Container from "react-bootstrap/Container";

import "../styles/style.css"
import "../styles/book-card.css"
import AccountNav from "../../components/AccountNav.tsx";
import React, {useEffect} from "react";
import SubscriptionPlans from "../../components/SubscriptionPlans.tsx";

function UserInfoPage() {

    useEffect(() => {

    }, []);

    return (
        <Container style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
            <AccountNav/>
            <SubscriptionPlans/>
        </Container>
    );
}

export default UserInfoPage;