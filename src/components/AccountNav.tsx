import React from "react";
import Nav from "react-bootstrap/Nav";
import Dropdown from "react-bootstrap/Dropdown";
import { useMediaQuery } from "react-responsive";

function AccountNav() {
    const isMobile = useMediaQuery({ maxWidth: 500 });

    const navItems = [
        { href: "/account", label: "Профиль" },
        { href: "/account/books", label: "Мои книги" },
        { href: "/account/achievements", label: "Достижения" },
        { href: "/account/settings", label: "Подписка" }
    ];

    if (isMobile) {
        return (
            <Dropdown style={{ margin: "10px" }}>
                <Dropdown.Toggle variant="primary" id="account-nav-dropdown">
                    Меню аккаунта
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    {navItems.map((item, idx) => (
                        <Dropdown.Item key={idx} href={item.href}>
                            {item.label}
                        </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </Dropdown>
        );
    }

    return (
        <Nav variant="tabs" className="justify-content-center" defaultActiveKey="" style={{ width: "75%", textAlign: "center", marginBottom: "10px" }}>
            {navItems.map((item, idx) => (
                <Nav.Item key={idx}>
                    <Nav.Link style={{ margin: "0 20px", textDecoration: "none" }} href={item.href}>
                        {item.label}
                    </Nav.Link>
                </Nav.Item>
            ))}
        </Nav>
    );
}

export default AccountNav;
