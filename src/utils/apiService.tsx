const apiServerUrl: string | undefined = 'https://jsonplaceholder.typicode.com';

export const fetchUsers = async () => {
    const users = await fetch(`${apiServerUrl}/users`)
        .then(response => response.json())
        .catch(error => console.error('Users list fetch call error:', error));

    return users;
};

export const fetchTodosAndAlbums = async () => {
    const [todosResponse, albumsResponse] = await Promise.all([
        fetch(`${apiServerUrl}/todos`)
            .then(response => response.json())
            .catch(error => console.error('Todo list fetch call error:', error)),
        fetch(`${apiServerUrl}/albums`)
            .then(response => response.json())
            .catch(error => console.error('Album list fetch call error:', error))
    ]);

    return { todosResponse, albumsResponse };
};

export const fetchAlbum = async (userId: string) => {
    const photos = fetch(`${apiServerUrl}/albums?userId=${userId}`)
        .then(response => response.json())
        .catch(error => console.error('Album of user fetch call error:', error));

    return photos;
};

export const fetchPhotos = async (albumId: string) => {
    const album = fetch(`${apiServerUrl}/photos?albumId=${albumId}`)
        .then(response => response.json())
        .catch(error => console.error('Album fetch call error:', error));

    return album;
};