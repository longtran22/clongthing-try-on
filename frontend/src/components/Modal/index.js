import React, { useEffect, useState } from 'react';
import './Modal.css'; 
import { FaRegUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import {useAuth} from "../introduce/useAuth"
import Avatar from '../Avatar';
import { notify } from '../../components/Notification/notification';
const Modal = () => {
  const {user,logout} =useAuth();
  const [isOpen, setIsOpen] = useState(false);
  console.log(user)
  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside modal-content
      if (isOpen && !document.querySelector('.modal-wrapper')?.contains(event.target)) {
        toggleModal();
      }
    };
    
    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);

  }, [isOpen]);


  return (
    <div className="modal-wrapper">
      <FaRegUser className="icon-user" onClick={toggleModal} />
      {isOpen && (
        <div className="uy-modal-content">
          <div className="user-info">
          <div className='uy-avatar-container'>
          <div className='uy-avatar'><Avatar name={user.name} imageUrl={user.avatar} /></div>
          </div>
            <div className="user-details">
              <strong>{user.name}</strong>
              <span className="email">{user.email}</span>
            </div>
          </div>
          <div className="menu-items">
         
            
            <div className="menu-item" onClick={() => {
                                      logout();
                                      
                                    }}
                                    >
              <i className="icon fa fa-sign-out-alt"></i> Logout
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Modal;
