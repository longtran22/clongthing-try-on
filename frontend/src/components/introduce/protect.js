// // ProtectedRoute.js
// import React from "react";
// import { Navigate } from "react-router-dom";
// import Cookies from 'js-cookie';

// function ProtectedRoute({ children }) {
//   const storedUser = Cookies.get("user");
//   let user = null;

//   if (storedUser) {
//     try {
//       const decodedString = decodeURIComponent(storedUser);
//       user = JSON.parse(decodedString);
//     } catch (error) {
//       console.error("Không thể giải mã hoặc phân tích dữ liệu người dùng:", error);
//     }
//   }

//   if (!user) {
//     // Nếu người dùng chưa đăng nhập, chuyển hướng đến trang đăng nhập
//     return <Navigate to="/" replace state={{ message: "Bạn phải đăng nhập" }} />;
//   }

//   return children;
// }

// export default ProtectedRoute;

// protect.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ children, role }) => {
  const userCookie = Cookies.get('user'); // Lưu thông tin người dùng vào cookie khi login
  if (!userCookie) return <Navigate to="/" />;

  const user = JSON.parse(userCookie);

  if (role && user.role !== role) {
    return <Navigate to="/" />; // Hoặc hiện trang "Không có quyền truy cập"
  }

  return children;
};

export default ProtectedRoute;
