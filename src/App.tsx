import { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import { Spinner, Table } from 'react-bootstrap';
import UserProfileModal from './UserProfileModal';
import { Album, ToDo, User } from './model';

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [todosCountMap, setTodosCountMap] = useState<{ [key: number]: number } | undefined>();
  const [photosCountMap, setPhotosCountMap] = useState<{ [key: number]: number } | undefined>();
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

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(response => response.json())
      .then(json => setUsers(json))
      .catch(error => console.error(error));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const todosResponse = await Promise.all(users.map(user =>
        fetch(`https://jsonplaceholder.typicode.com/todos?userId=${user?.id}`)
          .then(response => response.json())
          .catch(error => console.error(error))
      ));

      const albumsResponse = await Promise.all(users.map(user =>
        fetch(`https://jsonplaceholder.typicode.com/albums?userId=${user?.id}`)
          .then(response => response.json())
          .catch(error => console.error(error))
      ));

      const todosCountMapData: { [key: number]: number } = {};
      todosResponse.forEach((todos: ToDo[], index) => {
        const userId = users[index].id;
        todosCountMapData[userId] = todos.length;
      });

      const photosCountMapData: { [key: number]: number } = {};
      albumsResponse.forEach((albums: Album[], index) => {
        const userId = users[index].id;
        photosCountMapData[userId] = albums.length;
      });

      setTodosCountMap(todosCountMapData);
      setPhotosCountMap(photosCountMapData);
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
        {users && todosCountMap && photosCountMap ? (
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
                  </a></td>
                <td>{user.company.name}</td>
                <td>{todosCountMap[user.id]}</td>
                <td>{photosCountMap[user.id]}</td>
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
