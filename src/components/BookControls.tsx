import React, {useContext, useState} from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import {Dropdown, Stack} from "react-bootstrap";
import {enumStatus} from "../utils/Enums.ts"
import {useBookContext} from "./BookProvider.tsx";
import {useParams} from "react-router-dom";

import "../pages/style/book-card.css"
import {deleteUserBook, updateBookRating, updateBookStatus} from "../services/userBookService.ts";

function BookControls() {
    const { setUserRating, setStatus } = useBookContext();
    const gbId = useParams<{ id: string }>();
    const [ show, setShow ] = useState(false);
    const [ graphicsRating, setGraphicsRating ] = useState(5);
    const [ storyRating, setStoryRating ] = useState(5);
    const [ gameplayRating, setGameplayRating ] = useState(5);

    const graphicsSliderChange = (e) => setGraphicsRating(e.target.value);

    const storySliderChange = (e) => setStoryRating(e.target.value);

    const gameplaySliderChange = (e) => setGameplayRating(e.target.value);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Stack gap={3} style={{alignItems: 'center'}}>
                <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                        Изменить статус
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => updateBookStatus(gbId.id, enumStatus.Completed).then(() => setStatus("Completed"))}>
                            Прочитано
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => updateBookStatus(gbId.id, enumStatus.Playing).then(() => setStatus("Playing"))}>
                            Читаю
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => updateBookStatus(gbId.id, enumStatus.Planned).then(() => setStatus("Planned"))}>
                            В планах
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => updateBookStatus(gbId.id, enumStatus.Abandoned).then(() => setStatus("Abandoned"))}>
                            Заброшено
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <Button className="book__button" variant={"primary"} type={"button"} onClick={handleShow}>Изменить оценку</Button>
                <Button className="book__button" variant={"danger"} type={"button"} onClick={() => {deleteUserBook(gbId.id).then(() => window.location.reload())}}>Удалить книгу</Button>
            </Stack>

            <Modal show={show} centered={true} onHide={handleClose}
                   dialogClassName="modal-90w"
                   aria-labelledby="example-custom-modal-styling-title">
                <Modal.Header closeButton>
                    <Modal.Title>Оценка книги</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                        {/*<Form.Label>Graphics: {graphicsRating}</Form.Label>*/}
                        {/*<Form.Range value={graphicsRating} max={10} onChange={graphicsSliderChange}/>*/}

                        <Form.Label>История: {storyRating}</Form.Label>
                        <Form.Range value={storyRating} max={10} onChange={storySliderChange}/>

                        {/*<Form.Label>Gameplay: {gameplayRating}</Form.Label>*/}
                        {/*<Form.Range value={gameplayRating} max={10} onChange={gameplaySliderChange}/>*/}
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="outline-primary" onClick={handleClose}>Закрыть</Button>
                    <Button variant="primary" onClick={() => {
                        handleClose();
                        updateBookRating(gbId.id, storyRating).then(rating => {setUserRating(rating)});
                    }}>Сохранить оценку</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default BookControls;