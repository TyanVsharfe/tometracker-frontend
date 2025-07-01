import Container from "react-bootstrap/Container";
import {getScoreClass} from "../utils/Utils.ts";
import {ReviewProps} from "../services/userBookService.ts";
import React, {useEffect, useRef, useState} from "react";

import "../pages/styles/review.css"

const Review: React.FC<ReviewProps> = ({ bookReview }) => {
    const [expanded, setExpanded] = useState(false);
    const [isOverflowing, setIsOverflowing] = useState(false);
    const reviewTextRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (reviewTextRef.current) {
            const isTextOverflowing = reviewTextRef.current.scrollHeight > reviewTextRef.current.clientHeight;
            setIsOverflowing(isTextOverflowing);
        }
    }, [bookReview.review]);

    return (
        <Container style={{width: '30rem', maxHeight: '20rem'}} className='review'>
            <Container className='review-header'>
                <div>{bookReview.username}</div>
                {bookReview.userRating != undefined &&
                    <div className={getScoreClass(bookReview.userRating)}>{bookReview.userRating}</div>}
            </Container>
            <Container className={`review-text ${expanded ? "expanded" : ""}`} ref={reviewTextRef}>
                {bookReview.review}
            </Container>
            {isOverflowing && (
                <button className='review-text-button' onClick={() => setExpanded(!expanded)}>
                    {expanded ? "Скрыть" : "Читать далее"}
                </button>
            )}
        </Container>
    );
}

export default Review