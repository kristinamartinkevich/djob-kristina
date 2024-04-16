import { Col, ListGroup, Row, Spinner } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { Album, User } from '../../../model/model.ts';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import GoBackButton from '../../common/components/GoBackButton.tsx';

interface ProfileProps {
    user?: User;
}

type Section = {
    name: string;
    value: string;
}

function Profile({ }: ProfileProps) {
    const { userId } = useParams();
    const [user, setUser] = useState<User | undefined>();
    const [albums, setAlbums] = useState<Album[] | undefined>();
    const ProfileSections: Section[] = user ? [
        {
            name: 'Name',
            value: user.name
        },
        {
            name: 'E-mail',
            value: user.email
        }
    ] : [];
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const stateUser = (location.state as { user: User }).user;
        if (stateUser) {
            setUser(stateUser);
        }
    }, [location]);

    const handleShowAlbum = (albumId: number) => {
        navigate(`/users/${userId}/albums/${albumId}`);
    }

    useEffect(() => {
        fetch(`https://jsonplaceholder.typicode.com/albums?userId=${userId}`)
            .then(response => response.json())
            .then(json => setAlbums(json))
            .catch(error => console.error('Album of user fetch call error:', error))
    }, [userId]);

    return (
        <>
            <GoBackButton />
            {user && (
                <Row>
                    <Col>
                        <ListGroup>
                            {ProfileSections.map((section: Section, index: number) => (
                                <ListGroup.Item key={index}>
                                    <b>{section.name}</b>: {section.value}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Col>
                    <Col>
                        {albums ? (
                            <ListGroup>
                                <ListGroup.Item><b>Albums</b></ListGroup.Item>
                                {albums.map((album: Album) => (
                                    <ListGroup.Item key={album.id} action onClick={() => handleShowAlbum(album.id)}>
                                        {album.title}
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        ) : (
                            <Spinner animation="border" />
                        )}
                    </Col>
                </Row>
            )}
        </>
    );
};

export default Profile;
