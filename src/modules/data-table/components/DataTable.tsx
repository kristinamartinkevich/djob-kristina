import { useState, useEffect, useRef } from 'react'
import { Form, Overlay, Table, Tooltip } from 'react-bootstrap';
import Placeholders from '../../common/components/Placeholders';
import UserProfileModal from '../../profile/components/UserProfileModal';
import { Album, ToDo, User } from '../../../model';

const columnNames = [
    "#",
    "Username",
    "Email",
    "Website",
    "Company name",
    "TODOs",
    "Albums"
];

function DataTable() {
    const [users, setUsers] = useState<User[]>([]);
    const [todosMap, setTodosMap] = useState<{ [key: number]: ToDo[] } | undefined>();
    const [albumsMap, setAlbumsMap] = useState<{ [key: number]: Album[] } | undefined>();
    const [pickedUser, setPickedUser] = useState<User>();

    const [showUser, setShowUser] = useState(false);

    const [showToDos, setShowToDos] = useState<{ [key: number]: boolean }>({});
    const target = useRef(null);

    function handleCloseUserProfile() {
        setPickedUser(undefined);
        setShowUser(false);
    }

    function handleShowUserProfile(user: User) {
        setPickedUser(user);
        setShowUser(true);
    }

    const toggleShowTodos = (userId: number) => {
        setShowToDos(prevShowToDos => ({ ...prevShowToDos, [userId]: !prevShowToDos[userId] }));
    };

    const isTodoShown = (userId: number) => {
        return showToDos[userId]
    };

    const changeTodo = async (todo: ToDo, userId: number) => {
        fetch(`https://jsonplaceholder.typicode.com/todos/${todo.id}`, {
            method: 'PUT',
            body: JSON.stringify({
                completed: !todo.completed
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
            .then((response) => response.json())
            .catch(error => console.error('ToDo update call error:', error))

        setTodosMap(prevTodosMap => {
            if (!prevTodosMap) {
                return prevTodosMap;
            }

            return {
                ...prevTodosMap,
                [userId]: prevTodosMap[userId].map(prevTodo => {
                    if (prevTodo.id === todo.id) {
                        return {
                            ...prevTodo,
                            completed: !prevTodo.completed
                        };
                    }
                    return prevTodo;
                })
            };
        });
    };

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
                    .catch(error => console.error('Todo list fetch call error:', error))
                ,
                fetch(`https://jsonplaceholder.typicode.com/albums`)
                    .then(response => response.json())
                    .catch(error => console.error('Album list fetch call error:', error))
            ]);

            let filteredTodos: ToDo[][] = [];
            let filteredAlbums: Album[][] = [];

            users.map(user => {
                filteredTodos[user?.id - 1] = [];
                filteredAlbums[user?.id - 1] = [];

                todosResponse.forEach((todo: ToDo) => {
                    if (todo.userId === user?.id) {
                        filteredTodos[user?.id - 1].push(todo);
                    }
                });

                albumsResponse.forEach((album: Album) => {
                    if (album.userId === user?.id) {
                        filteredAlbums[user?.id - 1].push(album);
                    }
                });
            });

            const todosMapData: { [key: number]: ToDo[] } = {};
            const photosMapData: { [key: number]: Album[] } = {};

            filteredTodos.forEach((todos: ToDo[], index: number) => {
                todosMapData[users[index].id] = todos;
                showToDos[users[index].id] = false;
            });

            filteredAlbums.forEach((albums: Album[], index: number) => {
                photosMapData[users[index].id] = albums;
            });

            setTodosMap(todosMapData);
            setAlbumsMap(photosMapData);
        };

        if (users.length > 0) {
            fetchData();
        }
    }, [users]);

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
                {users && todosMap && albumsMap ? (
                    <>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>
                                    <a onClick={() => handleShowUserProfile(user)}>
                                        {user.username}
                                    </a></td>
                                <td>{user.email}</td>
                                <td>
                                    <a href={`http://${user?.website}`} target="_blank" rel="noopener noreferrer">
                                        {user.website}
                                    </a>
                                </td>
                                <td>{user.company.name}</td>
                                <>
                                    <Overlay target={target.current} show={showToDos[user.id]} placement="right">
                                        {(props) => (
                                            <Tooltip {...props}>
                                                ToDos of <b>{user.username}</b>
                                                <ol>
                                                    {todosMap && todosMap[user.id]?.map((todo: ToDo) => (
                                                        <li key={todo.id}>
                                                            <div className={`text-truncate d-flex fw-bold ${todo.completed ? 'green' : 'red'}`}>
                                                                <Form.Check
                                                                    className='mx-2'
                                                                    type="checkbox"
                                                                    checked={todo.completed}
                                                                    onChange={() => changeTodo(todo, user.id)}
                                                                />{todo.title}</div></li>
                                                    ))}
                                                </ol>
                                            </Tooltip>
                                        )}
                                    </Overlay>
                                </>
                                <td>
                                    <span className='mx-2'>
                                        {todosMap[user.id].length}
                                    </span>
                                    <a ref={target} className={isTodoShown(user.id) ? 'red' : 'green'}
                                        onClick={() => toggleShowTodos(user.id)}>
                                        {!isTodoShown(user.id) ? 'Open' : 'Close'}
                                    </a>
                                </td>
                                <td>{albumsMap[user.id].length}</td>
                            </tr>
                        ))}
                        {pickedUser && (
                            <UserProfileModal show={showUser} onHideUserProfile={handleCloseUserProfile} user={pickedUser} />
                        )}
                    </>
                ) : (
                    <Placeholders />
                )}
            </tbody>
        </Table>
    );
};

export default DataTable;
