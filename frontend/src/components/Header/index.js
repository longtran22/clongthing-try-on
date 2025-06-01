import { RiSettings4Line } from "react-icons/ri";
import { FaRegBell } from "react-icons/fa";
import { FaRegUser,FaSearch } from "react-icons/fa";
import '../Header/Header.css'
import Modal from "../Modal/index.js";

import Notification from "./noti.js"
function Header({size}) {
  return(<>
  
    {/* <div className="header" style={{width:`${size}%`,marginLeft:`${100-size}%`}}> */}
    <div className="header" style={{width:`100%`,marginLeft:`0%`}}>
      <div className="search-box">
      {/* <FaSearch className="search-icon"  />
      <i class="fas fa-search"></i>
      <input type="text" placeholder="Search ..."/> */}
      </div>
     
      <div className="header__right">
    
        <div className="header__notify"><Notification /></div>
        <div className="header__user"><Modal /></div>
      </div>
    </div></>
  )
}

export default Header;