import Nav from "react-bootstrap/Nav";

function AccountNav() {

    return (
        <Nav variant="tabs" className="justify-content-center" defaultActiveKey="" style={{width: "50%", textAlign: "center", marginBottom: "10px"}}>
            <Nav.Item>
                <Nav.Link style={{margin: "0 20px", textDecoration: "none"}} href="/account">Информация об аккаунте</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link style={{margin: "0 20px", textDecoration: "none"}} href="/account/books">Мои книги</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link style={{margin: "0 20px", textDecoration: "none"}} href="/account/settings">Подписка</Nav.Link>
            </Nav.Item>
        </Nav>
    );
};

export default AccountNav;