import { create } from 'zustand'
import { Album, ToDo, User } from './model/model';

interface StoreState {
    users: User[];
    todosMap: { [key: number]: ToDo[] } | undefined;
    albumsMap: { [key: number]: Album[] } | undefined;
    setUsers: (users: User[]) => void;
    setTodosMap: (todosMap: { [key: number]: ToDo[] }) => void;
    setAlbumsMap: (albumsMap: { [key: number]: Album[] }) => void;
}

const useStore = create<StoreState>((set) => ({
    users: [],
    todosMap: undefined,
    albumsMap: undefined,
    showToDos: {},
    setUsers: (users) => set({ users }),
    setTodosMap: (todosMap) => set({ todosMap }),
    setAlbumsMap: (albumsMap) => set({ albumsMap })
}));

export default useStore;