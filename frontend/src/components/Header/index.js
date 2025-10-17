import { RiSettings4Line } from "react-icons/ri";
import { FaRegBell } from "react-icons/fa";
import { FaRegUser,FaSearch } from "react-icons/fa";
import '../Header/Header.css'
import React, { useState, useRef,useEffect } from "react";
import Modal from "../Modal/index.js";
import { useNavigate } from 'react-router-dom';
import Notification from "./noti.js"
import Cookies from "js-cookie";
function Header({size}) {

    const [activeCategory, setActiveCategory] = useState('TRANG CHỦ');
  const [Itemnavbar, setitemnavbar] = useState('TRANG CHỦ');
  
  const navigate = useNavigate();

  const handleNavClick = (item) => {
  setActiveCategory(item);
  setitemnavbar(item);

  const userCookie = Cookies.get("user");
  console.log("userCookie (raw):", userCookie);

  if (!userCookie) {
    console.warn("Chưa có cookie user, chuyển về trang chủ");
    navigate("/");
    return;
  }

  const user = JSON.parse(userCookie); // ✅ parse ra object
  console.log("user object:", user);   // 👉 In ra để xem trong F12

  if (item === "TRANG CHỦ") {
    if (user.role === "User") navigate("/shop");
    else navigate("/home");
  }

  if (item === "ĐƠN HÀNG") {
    if (user.role === "User") navigate("/shop/import");
    else navigate("/home/import");
  }
};

  return(<>
  
    {/* <div className="header" style={{width:`${size}%`,marginLeft:`${100-size}%`}}> */}
    {/* <div className="header" style={{width:`100%`,marginLeft:`0%`}}> */}
      {/* <div className="search-box"> */}
      {/* <FaSearch className="search-icon"  />
      <i class="fas fa-search"></i>
      <input type="text" placeholder="Search ..."/> */}
      {/* </div>
     
      <div className="header__right">
    
        <div className="header__notify"><Notification /></div>
        <div className="header__user"><Modal /></div>
      </div>
    </div> */}
         <header className="header">
        <div className="header-content">
          <div className="logo">Otina</div>
          <nav className="nav">
            {['TRANG CHỦ', 'ÁO XUÂN HÈ', 'QUẦN', 'ĐƠN HÀNG', 'TÌM CỬA HÀNG', 'THÔNG TIN'].map((item) => (
              <button
                key={item}
                onClick={() => handleNavClick(item)}
                className={`nav-item ${activeCategory === item ? 'nav-item-active' : ''}`}
              >
                {item}
              </button>
            ))}
          </nav>
          <div className="search-container">
              <input
                type="text"
                placeholder="Tìm kiếm..."
                
               
                className="search-container"
              />
            <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>          
          </div>
         <div className="auth-buttons">
             <div className="header__notify"><Notification /></div>
              <div className="header__user"><Modal /></div>
         </div>
        </div>
      </header>
 
    </>
  )
}

export default Header;