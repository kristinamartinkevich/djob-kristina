import { Button, Modal, Spinner } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { Album, AlbumData } from './model.ts';

interface AlbumDataProps {
    show: boolean;
    onHideAlbum: () => void;
    album: Album;
}

const AlbumModal: React.FC<AlbumDataProps> = ({ show, onHideAlbum, album }) => {
    const [albumData, setAlbumData] = useState<AlbumData[]>();

    useEffect(() => {
        fetch(`https://jsonplaceholder.typicode.com/photos?albumId=${album?.id}`)
            .then(response => response.json())
            .then(json => setAlbumData(json))
            .catch(error => console.error(error));
    }, [album]);


    return (
        <Modal show={show} onHide={onHideAlbum}>
            <Modal.Header>
                <Modal.Title>{album.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {albumData ? (
                    <div>
                        {albumData?.map((album, index) => (
                            <img key={index} src={album.url} />
                        ))}
                    </div>
                ) : (
                    <Spinner animation="border" />
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHideAlbum}>
                    Go back to User Profile
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AlbumModal;
