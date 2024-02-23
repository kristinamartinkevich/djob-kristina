import { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import { Button, Spinner, Table } from 'react-bootstrap';
import UserProfileModal from './UserProfileModal';

export type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
};

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [todosCount, setTodosCount] = useState<number>(0);
  const [photosCount, setPhotosCount] = useState<number>(0);
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
      await Promise.all(users.map(user =>
        fetch(`https://jsonplaceholder.typicode.com/todos?userId=${user.id}`)
          .then(response => response.json())
          .then(json => setTodosCount(json.length))
          .catch(error => console.error(error))
      ));

      await Promise.all(users.map(user =>
        fetch(`https://jsonplaceholder.typicode.com/photos?albumId=${user.id}`)
          .then(response => response.json())
          .then(json => setPhotosCount(json.length))
          .catch(error => console.error(error))
      ));
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
            <th>TODOs</th>
            <th>Pics</th>
          </tr>
        </thead>
        {users && todosCount && photosCount ? (
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
                  <a href={`http://${user.website}`} target="_blank" rel="noopener noreferrer">
                    {user.website}
                  </a></td>
                <td>{user.company.name}</td>
                <td>{todosCount}
                </td>
                <td>{photosCount}
                </td>
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
