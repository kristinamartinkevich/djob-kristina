import { Button, Col, ListGroup, Modal, Row, Spinner, Table } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import AlbumModal from './AlbumModal.tsx';
import { Album, User } from './model.ts';

interface UserProfileProps {
    show: boolean;
    onHideUserProfile: () => void;
    user: User;
}

const UserProfileModal: React.FC<UserProfileProps> = ({ show, onHideUserProfile, user }) => {
    const [albums, setAlbums] = useState<Album[] | undefined>();
    const [pickedAlbum, setPickedAlbum] = useState<Album>();
    const [showAlbum, setShowAlbum] = useState(false);

    function handleCloseAlbum() {
        setPickedAlbum(undefined);
        setShowAlbum(false);
    }

    function handleShowAlbum(album: Album) {
        setPickedAlbum(album);
        setShowAlbum(true);
    }

    useEffect(() => {
        fetch(`https://jsonplaceholder.typicode.com/albums?userId=${user?.id}`)
            .then(response => response.json())
            .then(json => setAlbums(json))
            .catch(error => console.error(error));
    }, [user]);

    return (
        <Modal size="lg" show={show} onHide={onHideUserProfile}>
            <Modal.Header>
                <Modal.Title>User Profile of <b>{user.username}</b></Modal.Title>
                <Button variant="outline-secondary" onClick={onHideUserProfile}>
                    ← Users list
                </Button>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col lg="auto">
                        <ListGroup>
                            <ListGroup.Item><b>Name</b></ListGroup.Item>
                            <ListGroup.Item>{user.name}</ListGroup.Item>
                            <ListGroup.Item> <b>E-mail</b></ListGroup.Item>
                            <ListGroup.Item> <div>{user.email}</div></ListGroup.Item>
                        </ListGroup>
                    </Col>
                    <Col>
                        {albums ? (
                            <ListGroup>
                                <ListGroup.Item><b>Albums</b></ListGroup.Item>
                                {albums.map((album) => (
                                    <ListGroup.Item className='albums' as="li" key={album.id} action onClick={() => handleShowAlbum(album)}>
                                        {album.title}
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        ) : (
                            <Spinner animation="border" />
                        )}
                        {pickedAlbum && (
                            <AlbumModal show={showAlbum} onHideAlbum={handleCloseAlbum} album={pickedAlbum} />
                        )}
                    </Col>
                </Row>
            </Modal.Body >
        </Modal >
    );
};

export default UserProfileModal;
