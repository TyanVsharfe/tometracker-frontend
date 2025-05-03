import Card from "react-bootstrap/Card";
import {useBookContext} from "./BookProvider.tsx";
import {getStatusTranslation} from "../utils/Enums.ts";
import {getScoreClass} from "../utils/Utils.ts";

function BookInfo() {
    const { userRating, status } = useBookContext();

    return (
        <Card data-bs-theme="dark" style={{width: '15rem'}} className="text-center" border="light">
            <Card.Header>Информация пользователя о книге:</Card.Header>
            <Card.Body>
                <Card.Title>Статус: {getStatusTranslation(status) === undefined ? "Отсутствует" : getStatusTranslation(status)}</Card.Title>
                <Card.Text>
                    <br/>
                    {/*<p>Graphics</p>*/}
                    {/*<p>Story</p>*/}
                    {/*<p>Gameplay</p>*/}
                </Card.Text>
            </Card.Body>
            <Card.Footer style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>Оценка: {
                (userRating === null || userRating === undefined)
                    ? <div style={{display: 'flex', justifyContent: 'center', width: '9rem'}}>
                        Отсутствует
                    </div>
                    : <div style={{display: 'flex', justifyContent: 'center', width: '9rem'}}>
                        <div className={getScoreClass(userRating)} style={{width: '3rem'}}>{userRating}</div>
                    </div>
            }</Card.Footer>
        </Card>
    );
}

export default BookInfo