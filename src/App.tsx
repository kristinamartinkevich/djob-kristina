
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import DataTable from './modules/data-table/components/DataTable';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Album from './modules/album/components/Album';
import UserProfile from './modules/profile/components/Profile';


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<DataTable />} />
        <Route path="/users/:userId" element={<UserProfile />} />
        <Route path="/users/:userId/albums/:albumId" element={<Album />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
