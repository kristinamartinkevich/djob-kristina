import { Col, Container, Image, OverlayTrigger, Popover, Row, Spinner } from 'react-bootstrap';
import { useEffect } from 'react';
import { Photo } from '../../../model/model.ts';
import { useParams } from 'react-router-dom';
import GoBackButton from '../../common/components/GoBackButton.tsx';
import { fetchPhotos } from '../../../utils/apiService.tsx';
import useStore from '../../../store.ts';

function Album() {
    const { albumId } = useParams();
    const { setPhotos, photos } = useStore();

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
        if (albumId) {
            fetchPhotos(albumId)
                .then(album => setPhotos(album));
        }
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
