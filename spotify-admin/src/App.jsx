import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddSong from './pages/AddSong';
import AddAlbum from './pages/AddAlbum';
import AddPodcast from './pages/AddPodcast'; // ✅ Import
import ListSong from './pages/ListSong';
import ListAlbum from './pages/ListAlbum';
import ListPodcast from './pages/ListPodcast'; // ✅ Import
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

export const url = "http://localhost:5000";

const App = () => {
  return (
    <div className='flex items-start min-h-screen'>
      <ToastContainer />
      <Sidebar />
      <div className="flex-1 h-screen overflow-y-scroll bg-[#fcfffd]">
        <Navbar />
        <div className="pt-8 pl-5 sm:pt-12 sm:pl-12">
          <Routes>
            {/* Song Routes */}
            <Route path='/add-song' element={<AddSong />} />
            <Route path='/list-song' element={<ListSong />} />
            
            {/* Album Routes */}
            <Route path='/add-album' element={<AddAlbum />} />
            <Route path='/list-album' element={<ListAlbum />} />
            
            {/* Podcast Routes - NEW */}
            <Route path='/add-podcast' element={<AddPodcast />} />
            <Route path='/list-podcast' element={<ListPodcast />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default App