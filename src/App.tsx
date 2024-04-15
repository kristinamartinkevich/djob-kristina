
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import DataTable from './modules/data-table/components/DataTable';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import AlbumModal from './modules/album/components/AlbumModal';


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<DataTable />} />
        <Route path="album" element={<AlbumModal />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
