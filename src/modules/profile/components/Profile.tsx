import { Button, Col, ListGroup, Row, Spinner } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { Album, User } from '../../../model/model.ts';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

interface ProfileProps {
    user?: User;
}

function Profile({ }: ProfileProps) {
    const { albumId, userId } = useParams();
    const [user, setUser] = useState<User | undefined>();
    const [albums, setAlbums] = useState<Album[] | undefined>();
    const navigate = useNavigate();

    const location = useLocation();

    useEffect(() => {
        const stateUser = (location.state as { user: User }).user;
        if (stateUser) {
            setUser(stateUser);
        }
    }, [location]);

    function handleShowAlbum(albumId: number) {
        navigate(`/users/${userId}/albums/${albumId}`);
    }

    const goBack = () => {
        navigate(-1);
    };

    useEffect(() => {
        fetch(`https://jsonplaceholder.typicode.com/albums?userId=${userId}`)
            .then(response => response.json())
            .then(json => setAlbums(json))
            .catch(error => console.error('Album of user fetch call error:', error))
    }, [userId]);

    return (
        <Row>
            <Button variant="secondary" onClick={goBack}>Go Back</Button>
            {user && (
                <>
                    <Col lg="auto">
                        <ListGroup>
                            <ListGroup.Item><b>Name</b></ListGroup.Item>
                            <ListGroup.Item>{user.name}</ListGroup.Item>
                            <ListGroup.Item><b>E-mail</b></ListGroup.Item>
                            <ListGroup.Item><a href={`mailto:${user.email}`}>{user.email}</a></ListGroup.Item>
                        </ListGroup>
                    </Col>
                    <Col>
                        {albums ? (
                            <ListGroup>
                                <ListGroup.Item><b>Albums</b></ListGroup.Item>
                                {albums.map((album) => (
                                    <ListGroup.Item as="li" key={album.id} action onClick={() => handleShowAlbum(album.id)}>
                                        {album.title}
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        ) : (
                            <Spinner animation="border" />
                        )}
                    </Col>
                </>
            )}
        </Row>
    );
};

export default Profile;
