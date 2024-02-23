import { Button, Modal, Table } from 'react-bootstrap';
import { User } from './App.tsx'
import { useEffect, useState } from 'react';
import AlbumModal from './AlbumModal.tsx';

interface UserProfileProps {
    show: boolean;
    onHideUserProfile: () => void;
    user: User;
}

export type Album = {
    userId: number;
    id: number;
    title: string;
}

const UserProfileModal: React.FC<UserProfileProps> = ({ show, onHideUserProfile, user }) => {
    const [albums, setAlbums] = useState<Album[]>([]);
    const [pickedAlbum, setPickedAlbum] = useState<Album>();
    const [showAlbum, setShowAlbums] = useState(false);

    function handleCloseAlbum() {
        setPickedAlbum(undefined);
        setShowAlbums(false);
    }

    function handleShowAlbum(album: Album) {
        setPickedAlbum(album);
        setShowAlbums(true);
    }

    useEffect(() => {
        fetch(`https://jsonplaceholder.typicode.com/users/${user?.id}/albums`)
            .then(response => response.json())
            .then(json => setAlbums(json))
            .catch(error => console.error(error));
    }, [user]);

    return (
        <Modal show={show} onHide={onHideUserProfile}>
            <Modal.Header>
                <Modal.Title>{user.username}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Albums</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{user.name}</td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>
                                <ul>
                                    {albums.map((album, index) => (
                                        <li key={index}>
                                            <a onClick={() => handleShowAlbum(album)}>{album.title}</a>
                                        </li>
                                    ))}
                                </ul>
                            </td>
                            {pickedAlbum && (
                                <AlbumModal show={showAlbum} onHideAlbum={handleCloseAlbum} album={pickedAlbum} />
                            )}
                        </tr>
                    </tbody>
                </Table>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHideUserProfile}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default UserProfileModal;
