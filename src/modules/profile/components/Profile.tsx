import { Col, ListGroup, Row, Spinner } from 'react-bootstrap';
import { useEffect } from 'react';
import { Album, User } from '../../../model/model.ts';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import GoBackButton from '../../common/components/GoBackButton.tsx';
import { fetchAlbum } from '../../../utils/apiService.tsx';
import useStore from '../../../store.ts';

interface ProfileProps {
    user?: User;
}

type Section = {
    name: string;
    value: string;
}

function Profile({ }: ProfileProps) {
    const { userId } = useParams();
    const { user, setUser, albums, setAlbums } = useStore();
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
        if (userId) {
            fetchAlbum(userId)
                .then(album => setAlbums(album));
        }
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
