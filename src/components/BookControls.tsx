import React, {useContext, useState} from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import {Dropdown, Stack} from "react-bootstrap";
import {deleteBook, updateBookRating, updateBookStatus} from "../services/bookService.ts";
import {enumStatus} from "../utils/Enums.ts"
import {useBookContext} from "./BookProvider.tsx";
import {useParams} from "react-router-dom";

import "../pages/style/book-card.css"

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
                        Change status
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => updateBookStatus(gbId.id, enumStatus.Completed).then(() => setStatus("Completed"))}>
                            Completed
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => updateBookStatus(gbId.id, enumStatus.Playing).then(() => setStatus("Playing"))}>
                            Playing
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => updateBookStatus(gbId.id, enumStatus.Planned).then(() => setStatus("Planned"))}>
                            Planned
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => updateBookStatus(gbId.id, enumStatus.Abandoned).then(() => setStatus("Abandoned"))}>
                            Abandoned
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <Button className="book__button" variant={"primary"} type={"button"} onClick={handleShow}>Change rating</Button>
                <Button className="book__button" variant={"danger"} type={"button"} onClick={() => {deleteBook(gbId.id).then()}}>Delete book</Button>
            </Stack>

            <Modal show={show} centered={true} onHide={handleClose}
                   dialogClassName="modal-90w"
                   aria-labelledby="example-custom-modal-styling-title">
                <Modal.Header closeButton>
                    <Modal.Title>Set rating</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                        {/*<Form.Label>Graphics: {graphicsRating}</Form.Label>*/}
                        {/*<Form.Range value={graphicsRating} max={10} onChange={graphicsSliderChange}/>*/}

                        <Form.Label>Story: {storyRating}</Form.Label>
                        <Form.Range value={storyRating} max={10} onChange={storySliderChange}/>

                        {/*<Form.Label>Gameplay: {gameplayRating}</Form.Label>*/}
                        {/*<Form.Range value={gameplayRating} max={10} onChange={gameplaySliderChange}/>*/}
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="outline-primary" onClick={handleClose}>Close</Button>
                    <Button variant="primary" onClick={() => {
                        handleClose();
                        updateBookRating(gbId.id, storyRating).then(rating => {setUserRating(rating)});
                    }}>Save changes</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default BookControls;