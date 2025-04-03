import Container from "react-bootstrap/Container";
import { Stack} from "react-bootstrap";

import "../style/style.css"
import "../style/book-card.css"
import AccountNav from "../../components/AccountNav.tsx";

function UserInfoPage() {

    return (
        <Container style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
            <AccountNav/>

            <Container>
                <Stack className=".d-flex justify-content-center align-items-center">
                    <h1 className='page-title'>Информация</h1>
                    <h2>Имя пользователя</h2>
                </Stack>
            </Container>
        </Container>
    );
}

export default UserInfoPage;