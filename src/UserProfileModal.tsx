import { Button, ListGroup, Modal, Spinner, Table } from 'react-bootstrap';
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
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Albums</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>
                                {albums ? (
                                    <ListGroup as="ol" numbered>
                                        {albums.map((album, index) => (
                                            <ListGroup.Item as="li" key={index} action onClick={() => handleShowAlbum(album)}>
                                                {album.title}
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                ) : (
                                    <Spinner animation="border" />
                                )}
                            </td>
                            {pickedAlbum && (
                                <AlbumModal show={showAlbum} onHideAlbum={handleCloseAlbum} album={pickedAlbum} />
                            )}
                        </tr>
                    </tbody>
                </Table>
            </Modal.Body>
        </Modal >
    );
};

export default UserProfileModal;
