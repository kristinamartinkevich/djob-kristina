import { create } from 'zustand'
import { Album, ToDo, User } from './model';

interface StoreState {
    users: User[];
    todosMap: { [key: number]: ToDo[] } | undefined;
    albumsMap: { [key: number]: Album[] } | undefined;
    pickedUser: User | undefined;
    showUser: boolean;
    setUsers: (users: User[]) => void;
    setTodosMap: (todosMap: { [key: number]: ToDo[] }) => void;
    setAlbumsMap: (albumsMap: { [key: number]: Album[] }) => void;
    setPickedUser: (user: User | undefined) => void;
    setShowUser: (show: boolean) => void;
}

const useStore = create<StoreState>((set) => ({
    users: [],
    todosMap: undefined,
    albumsMap: undefined,
    pickedUser: undefined,
    showUser: false,
    showToDos: {},
    setUsers: (users) => set({ users }),
    setTodosMap: (todosMap) => set({ todosMap }),
    setAlbumsMap: (albumsMap) => set({ albumsMap }),
    setPickedUser: (pickedUser) => set({ pickedUser }),
    setShowUser: (showUser) => set({ showUser }),
}));

export default useStore;