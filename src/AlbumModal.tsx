import { Button, Modal, OverlayTrigger, Spinner, Tooltip } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { Album, AlbumData } from './model.ts';

interface AlbumDataProps {
    show: boolean;
    onHideAlbum: () => void;
    album: Album;
}

const AlbumModal: React.FC<AlbumDataProps> = ({ show, onHideAlbum, album }) => {
    const [albumData, setAlbumData] = useState<AlbumData[]>();

    const renderOverlay = (props: object, album: AlbumData) => (
        <Tooltip id="button-tooltip" {...props}>
            <div>{album.title}</div>
            <img alt={album.title} src={album.url} />
        </Tooltip>
    );

    useEffect(() => {
        fetch(`https://jsonplaceholder.typicode.com/photos?albumId=${album?.id}`)
            .then(response => response.json())
            .then(json => setAlbumData(json))
            .catch(error => console.error(error));
    }, [album]);


    return (
        <Modal show={show} onHide={onHideAlbum}>
            <Modal.Header>
                <Modal.Title>Album <b>{album.title}</b></Modal.Title>
                <Button variant="outline-secondary" onClick={onHideAlbum}>
                    ← User Profile
                </Button>
            </Modal.Header>
            <Modal.Body>
                {albumData ? (
                    <div>
                        {albumData?.map((album, index) => (
                            <span key={index}>
                                <OverlayTrigger
                                    placement="bottom"
                                    overlay={(props) => renderOverlay(props, album)}>
                                    <img alt={album.title} src={album.thumbnailUrl} />
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
