import { create } from 'zustand';
import { Album, ToDo, User, Photo } from './model/model';

interface StoreState {
    users: User[];
    todosMap: { [key: number]: ToDo[] } | undefined;
    albumsMap: { [key: number]: Album[] } | undefined;
    photos: Photo[] | undefined;
    file: File | undefined;
    user: User | undefined;
    albums: Album[] | undefined;
    setUser: (user: User) => void;
    setAlbums: (user: Album[]) => void;
    setUsers: (users: User[]) => void;
    setTodosMap: (todosMap: { [key: number]: ToDo[] }) => void;
    setAlbumsMap: (albumsMap: { [key: number]: Album[] }) => void;
    setPhotos: (photos: Photo[]) => void;
    setFile: (file: File) => void;
}

const useStore = create<StoreState>((set) => ({
    users: [],
    todosMap: undefined,
    albumsMap: undefined,
    photos: undefined,
    file: undefined,
    user: undefined,
    albums: undefined,
    setUser: (user: User) => set({ user }),
    setAlbums: (albums: Album[]) => set({ albums }),
    setUsers: (users) => set({ users }),
    setTodosMap: (todosMap) => set({ todosMap }),
    setAlbumsMap: (albumsMap) => set({ albumsMap }),
    setPhotos: (photos) => set({ photos }),
    setFile: (file) => set({ file })
}));

export default useStore;
