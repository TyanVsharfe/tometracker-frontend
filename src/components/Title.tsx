import React from 'react';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

interface TitleProps {
    title: string;
}

const Title: React.FC<TitleProps> = ({ title }) => {
    const truncatedTitle = title.length > 30 ? `${title.slice(0, 30)}...` : title;

    return (
        <OverlayTrigger
            placement="bottom"
            overlay={<Tooltip id="tooltip-title">{title}</Tooltip>}
        >
            <Button variant="light" style={{ paddingLeft: "0px", background: 'none' }}>
                <span className="ms-1">{truncatedTitle}</span>
            </Button>
        </OverlayTrigger>
    );
};

export default Title;
