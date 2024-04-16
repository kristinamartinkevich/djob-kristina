import { Button, Col, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function GoBackButton() {
    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1);
    };

    return (
        <Row className='justify-content-start mb-3'>
            <Col lg="auto">
                <Button variant="secondary" onClick={goBack}>← Profile</Button>
            </Col>
        </Row>
    );
};

export default GoBackButton;
