import { useEffect } from 'react'
import { Table } from 'react-bootstrap';
import Placeholders from '../../common/components/Placeholders';
import { Album, ToDo, User } from '../../../model/model';
import useStore from '../../../store';
import { useNavigate } from 'react-router-dom';

const columnNames = [
    '#',
    'Username',
    'Email',
    'Website',
    'Company name',
    'TODOs',
    'Albums'
];

function DataTable() {
    const navigate = useNavigate();

    const {
        users,
        todosMap,
        albumsMap,
        setUsers,
        setTodosMap,
        setAlbumsMap,
    } = useStore();

    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/users')
            .then(response => response.json())
            .then(json => setUsers(json))
            .catch(error => console.error('Users list fetch call error:', error))
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const [todosResponse, albumsResponse] = await Promise.all([
                fetch(`https://jsonplaceholder.typicode.com/todos`)
                    .then(response => response.json())
                    .catch(error => console.error('Todo list fetch call error:', error)),
                fetch(`https://jsonplaceholder.typicode.com/albums`)
                    .then(response => response.json())
                    .catch(error => console.error('Album list fetch call error:', error))
            ]);

            const todosMapData: { [key: number]: ToDo[] } = {};
            const photosMapData: { [key: number]: Album[] } = {};

            users.forEach(user => {
                const userTodos = todosResponse.filter((todo: ToDo) => todo.userId === user.id);
                const userAlbums = albumsResponse.filter((album: Album) => album.userId === user.id);

                todosMapData[user.id] = userTodos;
                photosMapData[user.id] = userAlbums;
            });

            setTodosMap(todosMapData);
            setAlbumsMap(photosMapData);
        };
        if (users.length > 0) {
            fetchData();
        }
    }, [users]);

    function handleShowUserProfile(user: User) {
        navigate(`/users/${user.id}`, { state: { user } });
    }

    const populateRows = () => {
        if (!users || !todosMap || !albumsMap) {
            return <Placeholders />;
        }

        return (
            <>
                {users.map((user) => (
                    <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>
                            <a onClick={() => handleShowUserProfile(user)}>
                                {user.username}
                            </a>
                        </td>
                        <td>{user.email}</td>
                        <td>
                            <a href={`http://${user?.website}`} target='_blank' rel='noopener noreferrer'>
                                {user.website}
                            </a>
                        </td>
                        <td>{user.company.name}</td>
                        <td>
                            <span className='mx-2'>
                                {todosMap[user.id].length}
                            </span>
                        </td>
                        <td>{albumsMap[user.id].length}</td>
                    </tr>
                ))}
            </>
        );
    };


    return (
        <Table striped bordered hover responsive>
            <thead>
                <tr>
                    {columnNames.map((name, index) => (
                        <th key={index}>{name}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {populateRows()}
            </tbody>
        </Table>
    );
};

export default DataTable;
