import { useEffect } from 'react'
import { Table } from 'react-bootstrap';
import TablePlaceholders from './TablePlaceholders';
import { Album, ToDo, User } from '../../../model/model';
import useStore from '../../../store';
import { useNavigate } from 'react-router-dom';
import { fetchTodosAndAlbums, fetchUsers } from '../../../utils/apiService';


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
        fetchUsers()
            .then(users => setUsers(users))
    });

    const fetchData = async () => {
        const { todosResponse, albumsResponse } = await fetchTodosAndAlbums();
        processResponse(todosResponse, albumsResponse);
    };

    useEffect(() => {
        if (users.length > 0) {
            fetchData();
        }
    }, [users]);

    const processResponse = (todosResponse: ToDo[], albumsResponse: Album[]) => {
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

    const handleShowUserProfile = (user: User) => {
        navigate(`/users/${user.id}`, { state: { user } });
    }

    const populateRows = () => {
        if (!users || !todosMap || !albumsMap) {
            return <TablePlaceholders />;
        }

        return (
            <>
                {users.map((user: User) => (
                    <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>
                            <a onClick={() => handleShowUserProfile(user)}>
                                {user.username}
                            </a>
                        </td>
                        <td>{user.email}</td>
                        <td>
                            <a href={`http://${user.website}`} target='_blank' rel='noopener noreferrer'>
                                {user.website}
                            </a>
                        </td>
                        <td>{user.company.name}</td>
                        <td>{todosMap[user.id].length}</td>
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
                    {columnNames.map((name: string, index: number) => (
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
