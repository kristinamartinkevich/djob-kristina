import { Button, Image, Modal, OverlayTrigger, Popover, Row, Spinner } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { Album, Photo } from '../../../model.ts';

interface AlbumDataProps {
    show: boolean;
    onHideAlbum: () => void;
    album: Album;
}

const AlbumModal: React.FC<AlbumDataProps> = ({ show, onHideAlbum, album }) => {
    const [photos, setPhotos] = useState<Photo[]>();

    const renderOverlay = (props: object, album: Photo) => (
        <Popover {...props}>
            <Popover.Header as="h3">{album.title}</Popover.Header>
            <Popover.Body>
                <Row className='justify-content-center'>
                    <img alt={album.title} src={album.url} className='photo' />
                </Row>
            </Popover.Body>
        </Popover>
    );

    useEffect(() => {
        fetch(`https://jsonplaceholder.typicode.com/photos?albumId=${album?.id}`)
            .then(response => response.json())
            .then(json => setPhotos(json))
            .catch(error => console.error('Album fetch call error:', error))
    }, [album]);


    return (
        <Modal size="lg" show={show} onHide={onHideAlbum}>
            <Modal.Header>
                <Modal.Title>Album <b>{album.title}</b></Modal.Title>
                <Button variant="outline-secondary" onClick={onHideAlbum}>
                    ← User Profile
                </Button>
            </Modal.Header>
            <Modal.Body>
                {photos ? (
                    <div>
                        {photos?.map((photo) => (
                            <span key={photo.id}>
                                <OverlayTrigger
                                    overlay={(props) => renderOverlay(props, photo)}>
                                    <Image alt={photo.title} src={photo.thumbnailUrl} thumbnail />
                                </OverlayTrigger>
                            </span>
                        ))}
                    </div>
                ) : (
                    <Spinner animation="border" />
                )}
            </Modal.Body>
        </Modal>
    );
};

export default AlbumModal;
