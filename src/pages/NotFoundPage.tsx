import Container from "react-bootstrap/Container";

const NotFoundPage: React.FC = () => {
    return (
        <Container style={{textAlign: "center"}}>
            <Container>
                <h2>404</h2>
                <h3>Page not found.</h3>
            </Container>
        </Container>
    );
};

export default NotFoundPage;