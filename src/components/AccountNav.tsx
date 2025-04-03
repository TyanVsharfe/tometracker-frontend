import Nav from "react-bootstrap/Nav";

function AccountNav() {

    return (
        <Nav variant="tabs" className="justify-content-center" defaultActiveKey="" style={{width: "50%"}}>
            <Nav.Item>
                <Nav.Link href="/account">Информация о аккаунте</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link href="/account/books">Мои книги</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link href="">Настройки</Nav.Link>
            </Nav.Item>
        </Nav>
    );
};

export default AccountNav;