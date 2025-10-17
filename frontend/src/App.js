
// import './App.css';
// import { Route, Routes } from 'react-router-dom';
// import LayoutDefault from './layouts/LayoutDefault';
// import LayoutUser from './layouts/LayoutUser';
// import Home from './pages/Home';
// import ManageProduct from './pages/ManageProduct';
// import Profile from './pages/Profile/index.js';
// import Import from './pages/Import';

// import ManageAccount from './pages/ManageAccount/index.js';
// import RolesGroup from './pages/RolesGroup/index.js';
// import Permissions from './pages/Permission/index.js';

// import Main from './components/introduce/Main_intro.js';

// import ProtectedRoute from './components/introduce/protect.js';
// import { Loading } from './components/introduce/Loading.js';

// import Notification from './components/Notification/notification.js';

// import Shop from './pages/Shop/index.js'; // ✨ Giao diện User
// // import TryOn from './pages/TryOn/index.js'; // ✨ Thử đồ

// function App() {
//   return (
//     <>
//       <Loading />
//       <Notification />
//       <Routes>
//         {/* ✨ Trang landing */}
//         <Route path="/" element={<Main />} />

//         {/* ✅ Admin */}
//         <Route
//           path="/home"
//           element={
//             <ProtectedRoute role="Admin">
//               <LayoutDefault />
//             </ProtectedRoute>
//           }
//         >
//           <Route index element={<Home />} />
//           <Route path='profile' element={<Profile/>}/>
//           <Route path="manage-product" element={<ManageProduct />} />
//           <Route path="import" element={<Import />} />
//           <Route path = 'roles-group' element={<RolesGroup/>}/>
//           <Route path = 'manage-account' element={<ManageAccount/>}/>
//           <Route path = 'permissions' element={<Permissions/>}/>
          
//         </Route>
//         <Route
//           path="/home"
//           element={
//             <ProtectedRoute role="freshstaff">
//               <LayoutDefault />
//             </ProtectedRoute>
//           }
//         >
//           <Route index element={<Home />} />
//           <Route path='profile' element={<Profile/>}/>
//           <Route path="manage-product" element={<ManageProduct />} />
//           <Route path="import" element={<Import />} />
//           <Route path = 'roles-group' element={<RolesGroup/>}/>
//           <Route path = 'manage-account' element={<ManageAccount/>}/>
//           <Route path = 'permissions' element={<Permissions/>}/>
          
//         </Route>

//         {/* User */}
//         <Route
//           path="/shop"
//           element={
//             <ProtectedRoute role="User">
//               <LayoutUser/>
//             </ProtectedRoute>
//           }
//         >
//           <Route index element={<Shop />} />
//           {/* <Route path="try-on" element={<TryOn />} /> */}
//           <Route path='profile' element={<Profile/>}/>
          
//            <Route path="import" element={<Import />} />
//         </Route>


//       </Routes>
//     </>
//   );
// }

// export default App;


import { Route, Routes, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import ProtectedRoute from './components/introduce/protect';
import LayoutDefault from './layouts/LayoutDefault';
import LayoutUser from './layouts/LayoutUser';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Profile from './pages/Profile';
import ManageProduct from './pages/ManageProduct';
import Import from './pages/Import';
import RolesGroup from './pages/RolesGroup';
import ManageAccount from './pages/ManageAccount';
import Permissions from './pages/Permission';
import Main from './components/introduce/Main_intro';
import { Loading } from './components/introduce/Loading';
import Notification from './components/Notification/notification';

function App() {
  const userCookie = Cookies.get('user');
  const user = userCookie ? JSON.parse(userCookie) : null;
  const role = user?.role;

  return (
    <>
      <Loading />
      <Notification />
      <Routes>
        {/* Trang landing */}
        <Route path="/" element={<Main />} />

        {/* 👉 Route trung gian để tự điều hướng theo role */}
        <Route
          path="/dashboard"
          element={
            role === 'User' ? (
              <Navigate to="/shop" replace />
            ) : (
              <Navigate to="/home" replace />
            )
          }
        />

        {/* Layout Admin, Staff, Manager... */}
        <Route
          path="/home/*"
          element={
            <ProtectedRoute excludeRole="User">
              <LayoutDefault />
            </ProtectedRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="profile" element={<Profile />} />
          <Route path="manage-product" element={<ManageProduct />} />
          <Route path="import" element={<Import />} />
          <Route path="roles-group" element={<RolesGroup />} />
          <Route path="manage-account" element={<ManageAccount />} />
          <Route path="permissions" element={<Permissions />} />
        </Route>

        {/* Layout người dùng */}
        <Route
          path="/shop/*"
          element={
            <ProtectedRoute onlyRole="User">
              <LayoutUser />
            </ProtectedRoute>
          }
        >
          <Route index element={<Shop />} />
          <Route path="profile" element={<Profile />} />
          <Route path="import" element={<Import />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
