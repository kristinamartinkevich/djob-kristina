import { useState, useEffect, useRef } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import { Form, Overlay, Placeholder, Table, Tooltip } from 'react-bootstrap';
import UserProfileModal from './UserProfileModal';
import { Album, ToDo, User } from './model';

function App() {
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

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(response => response.json())
      .then(json => setUsers(json))
      .catch(error => console.error('Users list fetch call error:', error))
  }, []);

  function handleToDoCheckChange(userId: number, todoId: number) {
    setTodosMap(prevTodosMap => {
      if (!prevTodosMap) {
        return prevTodosMap;
      }

      return {
        ...prevTodosMap,
        [userId]: prevTodosMap[userId].map(todo => {
          if (todo.id === todoId) {
            return {
              ...todo,
              completed: !todo.completed
            };
          }
          return todo;
        })
      };
    });
  }

  useEffect(() => {
    const fetchData = async () => {
      const [todosResponse, albumsResponse] = await Promise.all([
        Promise.all(users.map(user =>
          fetch(`https://jsonplaceholder.typicode.com/todos?userId=${user?.id}`)
            .then(response => response.json())
            .catch(error => console.error('Todo list fetch call error:', error))
        )),
        Promise.all(users.map(user =>
          fetch(`https://jsonplaceholder.typicode.com/albums?userId=${user?.id}`)
            .then(response => response.json())
            .catch(error => console.error('Album list fetch call error:', error))
        ))
      ]);

      const todosMapData: { [key: number]: ToDo[] } = {};
      const photosMapData: { [key: number]: Album[] } = {};

      todosResponse.forEach((todos: ToDo[], index: number) => {
        todosMapData[users[index].id] = todos;
        showToDos[users[index].id] = false;
      });

      albumsResponse.forEach((albums: Album[], index: number) => {
        photosMapData[users[index].id] = albums;
      });

      setTodosMap(todosMapData);
      setAlbumsMap(photosMapData);
    };

    if (users.length > 0) {
      fetchData();
    }
  }, [users]);

  const changeTodo = async (todo: ToDo) => {
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
  };

  function toggleShowToDos(userId: number) {
    setShowToDos(prevShowToDos => {
      const updatedShowToDos = { ...prevShowToDos };
      updatedShowToDos[userId] = !prevShowToDos[userId];
      Object.keys(updatedShowToDos).forEach(key => {
        if (parseInt(key) !== userId) {
          updatedShowToDos[Number(key)] = false;
        }
      });
      return updatedShowToDos;
    });
  }

  return (
    <>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Username</th>
            <th>Email</th>
            <th>Website</th>
            <th>Company name</th>
            <th>TODOs</th>
            <th>Albums</th>
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
                                    onChange={() => handleToDoCheckChange(user.id, todo.id)}
                                    onClick={() => changeTodo(todo)}
                                  />{todo.title}</div></li>
                            ))}
                          </ol>
                        </Tooltip>
                      )}
                    </Overlay>
                  </>
                  <td className='purple'>
                    <span className='mx-2'>
                      {todosMap[user.id].length}
                    </span>
                    <a ref={target} onClick={() => toggleShowToDos(user.id)}>
                      {!showToDos[user.id] ? 'Open' : 'Close'}
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
            Array.from({ length: 10 }, (_, rowIndex) => (
              <tr key={rowIndex}>
                {Array.from({ length: 7 }, (_, colIndex) => (
                  <td key={colIndex}>
                    <Placeholder lg={12} />
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </>
  )
}

export default App
