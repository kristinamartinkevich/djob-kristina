import { Col, Container, Image, OverlayTrigger, Popover, Row, Spinner } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { Photo } from '../../../model/model.ts';
import { useParams } from 'react-router-dom';
import GoBackButton from '../../common/components/GoBackButton.tsx';

function Album() {
    const { albumId } = useParams();
    const [photos, setPhotos] = useState<Photo[]>();

    const renderOverlay = (props: object, album: Photo) => (
        <Popover {...props}>
            <Popover.Header as="h3">{album.title}</Popover.Header>
            <Popover.Body>
                <Row className='justify-content-center'>
                    <Image alt={album.title} src={album.url} className='photo' />
                </Row>
            </Popover.Body>
        </Popover>
    );

    useEffect(() => {
        fetch(`https://jsonplaceholder.typicode.com/photos?albumId=${albumId}`)
            .then(response => response.json())
            .then(json => setPhotos(json))
            .catch(error => console.error('Album fetch call error:', error))
    }, [albumId]);

    return (
        <Container>
            <GoBackButton />
            <Row className='justify-content-center'>
                {photos ? (
                    <Col>
                        {photos?.map((photo: Photo) => (
                            <OverlayTrigger key={photo.id}
                                overlay={(props) => renderOverlay(props, photo)}>
                                <Image alt={photo.title} src={photo.thumbnailUrl} thumbnail />
                            </OverlayTrigger>
                        ))}
                    </Col>
                ) : (
                    <Spinner animation="border" />
                )}
            </Row>
        </Container>
    );
};

export default Album;
