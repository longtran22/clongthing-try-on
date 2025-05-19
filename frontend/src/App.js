
import './App.css';
import { Route, Routes } from 'react-router-dom';
import LayoutDefault from './layouts/LayoutDefault';
import LayoutUser from './layouts/LayoutUser';
import Home from './pages/Home';
import ManageProduct from './pages/ManageProduct';

import Import from './pages/Import';

import Main from './components/introduce/Main_intro.js';

import ProtectedRoute from './components/introduce/protect.js';
import { Loading } from './components/introduce/Loading.js';

import Notification from './components/Notification/notification.js';

import Shop from './pages/Shop/index.js'; // ✨ Giao diện User
// import TryOn from './pages/TryOn/index.js'; // ✨ Thử đồ

function App() {
  return (
    <>
      <Loading />
      <Notification />
      <Routes>
        {/* ✨ Trang landing */}
        <Route path="/" element={<Main />} />

        {/* ✅ Admin */}
        <Route
          path="/home"
          element={
            <ProtectedRoute role="Admin">
              <LayoutDefault />
            </ProtectedRoute>
          }
        >
          <Route index element={<Home />} />
   
          <Route path="manage-product" element={<ManageProduct />} />
          <Route path="import" element={<Import />} />
          
        </Route>

        {/* User */}
        <Route
          path="/shop"
          element={
            <ProtectedRoute role="User">
              <LayoutUser/>
            </ProtectedRoute>
          }
        >
          <Route index element={<Shop />} />
          {/* <Route path="try-on" element={<TryOn />} /> */}
          
           <Route path="import" element={<Import />} />
        </Route>


      </Routes>
    </>
  );
}

export default App;
