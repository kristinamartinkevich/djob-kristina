import { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import { OverlayTrigger, Spinner, Table, Tooltip } from 'react-bootstrap';
import UserProfileModal from './UserProfileModal';
import { Album, ToDo, User } from './model';

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [todosMap, setTodosMap] = useState<{ [key: number]: ToDo[] } | undefined>();
  const [albumsMap, setAlbumsMap] = useState<{ [key: number]: Album[] } | undefined>();
  const [pickedUser, setPickedUser] = useState<User>();

  const [showUser, setShowUser] = useState(false);

  function handleCloseUserProfile() {
    setPickedUser(undefined);
    setShowUser(false);
  }

  function handleShowUserProfile(user: User) {
    setPickedUser(user);
    setShowUser(true);
  }

  const renderOverlay = (props: object, userId: number) => (
    <Tooltip id="button-tooltip" {...props}>
      <ol>
        {todosMap && todosMap[userId]?.map((todo: ToDo, index: number) => (
          <li key={index}>
            <div className='text-truncate'>{todo.title}</div></li>
        ))}
      </ol>
    </Tooltip>
  );

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(response => response.json())
      .then(json => setUsers(json))
      .catch(error => console.error(error));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const [todosResponse, albumsResponse] = await Promise.all([
        Promise.all(users.map(user =>
          fetch(`https://jsonplaceholder.typicode.com/todos?userId=${user?.id}`)
            .then(response => response.json())
            .catch(error => console.error(error))
        )),
        Promise.all(users.map(user =>
          fetch(`https://jsonplaceholder.typicode.com/albums?userId=${user?.id}`)
            .then(response => response.json())
            .catch(error => console.error(error))
        ))
      ]);

      const todosMapData: { [key: number]: ToDo[] } = {};
      const photosMapData: { [key: number]: Album[] } = {};

      todosResponse.forEach((todos: ToDo[], index: number) => {
        todosMapData[users[index].id] = todos;
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
            <th>Number of TODOs</th>
            <th>Number of Albums</th>
          </tr>
        </thead>
        {users && todosMap && albumsMap ? (
          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
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
                <OverlayTrigger
                  placement="right"
                  overlay={(props) => renderOverlay(props, user.id)}>
                  <td className='todos'>{todosMap[user.id].length}</td>
                </OverlayTrigger>
                <td>{albumsMap[user.id].length}</td>
              </tr>
            ))}
            {pickedUser && (
              <UserProfileModal show={showUser} onHideUserProfile={handleCloseUserProfile} user={pickedUser} />
            )}
          </tbody>
        ) : (
          <Spinner animation="border" />
        )}
      </Table>
    </>
  )
}

export default App
