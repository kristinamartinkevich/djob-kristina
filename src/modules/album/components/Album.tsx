import { Button, Image, OverlayTrigger, Popover, Row, Spinner } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { Photo } from '../../../model/model.ts';
import { useNavigate, useParams } from 'react-router-dom';


function Album() {
    const { albumId } = useParams();
    const [photos, setPhotos] = useState<Photo[]>();
    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1);
    };

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
        fetch(`https://jsonplaceholder.typicode.com/photos?albumId=${albumId}`)
            .then(response => response.json())
            .then(json => setPhotos(json))
            .catch(error => console.error('Album fetch call error:', error))
    }, [albumId]);


    return (
        <>
            <Button variant="secondary" onClick={goBack}>Go Back</Button>
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
        </>
    );
};

export default Album;
