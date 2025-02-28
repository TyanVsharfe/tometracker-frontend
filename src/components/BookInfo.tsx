import Card from "react-bootstrap/Card";
import {useBookContext} from "./BookProvider.tsx";

function BookInfo() {
    const { userRating, status } = useBookContext();

    return (
        <Card data-bs-theme="dark" style={{width: '15rem'}} className="text-center" border="light">
            <Card.Header>User Book Information</Card.Header>
            <Card.Body>
                <Card.Title>Status: {status}</Card.Title>
                <Card.Text>
                    <br/>
                    {/*<p>Graphics</p>*/}
                    {/*<p>Story</p>*/}
                    {/*<p>Gameplay</p>*/}
                </Card.Text>
            </Card.Body>
            <Card.Footer>Final rating: {userRating === undefined ? "no rating" : userRating}</Card.Footer>
        </Card>
    );
}

export default BookInfo