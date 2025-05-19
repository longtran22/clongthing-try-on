import { Link, useLocation } from "react-router-dom";
import './Sidebar.css';
import { MdOutlineHome } from "react-icons/md";

import { TbPackageImport, TbPackageExport } from "react-icons/tb";

import { useState, useEffect } from "react";


import { useContext } from 'react';
import { AuthContext } from '../../components/introduce/AuthContext';
import a from '../../components/introduce/img/logo2-removebg-preview.png'


function Sidebar({ change }) {
  const location = useLocation();  // Lấy thông tin đường dẫn hiện tại
  const [selected, setSelected] = useState(1);  // Trạng thái mặc định cho mục được chọn
  const [isExpanded, setIsExpanded] = useState(true);  // Trạng thái cho sidebar có mở rộng hay không
  const [isAddOpen, setIsAddOpen] = useState(false); 
  
  const { user } = useContext(AuthContext);
  const avar = user?.avatar ;
  const toggleAddDropdown = () => {
    console.log(isAddOpen)
    setIsAddOpen(!isAddOpen);
  };
  // Cập nhật trạng thái `selected` dựa trên đường dẫn hiện tại
  useEffect(() => {
    switch (location.pathname) {
      case '/shop':
        setSelected(1);
        break;
      case '/shop/import':
        setSelected(3);
        break;
     
      
      default:
        setSelected(1); // Nếu không khớp với bất kỳ trường hợp nào, thiết lập mặc định là 1
    }
  }, [location.pathname]);

  // Hàm để chuyển đổi kích thước sidebar
  const toggleSidebar = () => {
    change();  // Gọi hàm change từ prop
    setIsExpanded(!isExpanded);  // Đảo ngược trạng thái mở rộng
  };
  return (
    <ul className="sidebar" style={{ width: isExpanded ? "20%" : "4%" }}>
      <div className="logo-header" style={isExpanded ? {} : { display: "flex", justifyContent: "center", alignItems: "center" }}>
        {isExpanded && (
          <a href="/shop">
         <img src={a} style={{ marginLeft: '30%' }} height="80px" alt="Logo" />

          </a>
        )}
        <div className={`sidebar__icon ${!isExpanded ? "add_jus" : ""}`} style={!isExpanded?{marginRight:"0px",cursor:"pointer"}:{cursor:"pointer"}} onClick={toggleSidebar}>
          <svg
            stroke="currentColor"
            fill="black"
            strokeWidth="0"
            viewBox="0 0 24 24"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z" />
          </svg>
        </div>
      </div>
      <li className="sidebar__home">
        <Link className={`sidebar__link ${selected === 1 ? 'active' : ''} ${!isExpanded ? "add_jus" : ""}`} style={!isExpanded?{padding:"15px 0px"}:{}} to='/shop'>
          <div className="sidebar__icon" style={!isExpanded?{marginRight:"0px"}:{}}><MdOutlineHome /></div>
          {isExpanded && "Cửa hàng"}
        </Link>
      </li>
      <li className="sidebar__import">
        <Link className={`sidebar__link ${selected === 3 ? 'active' : ''} ${!isExpanded ? "add_jus" : ""}`} style={!isExpanded?{padding:"15px 0px"}:{}} to='/shop/import'>
          <div className="sidebar__icon" style={!isExpanded?{marginRight:"0px"}:{}}><TbPackageImport /></div>
          {isExpanded && "Quản lý giỏ hàng"}
        </Link>
      </li>
   
    </ul>
  );
}

export default Sidebar;
