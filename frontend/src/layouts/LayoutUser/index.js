import { Outlet } from "react-router-dom";
import Header from "../../components/Header";
import Sidebar from "../../components/SidebarUser";
import React, { useState,useEffect } from "react";
import help from "../../../src/components/introduce/img/chat.png"
import Chat from "../../../src/pages/Home/chat"
import "../LayoutUser/index.css"
function LayoutUser(){
// const [size,formSize]=useState(80)
const [size,formSize]=useState(100)
const [chat,setChat]=useState(false)
const [ring2,setRing2]=useState(false)
const change=()=>{
  formSize((a)=>{if(a==80) return 96;else return 80});
}
const ring=()=>{
setRing2(true);
  
}
  return(
    <>
     
      <main>
        {/* <Sidebar change={change}/> */}
        <div style={{width:`${size}%`,marginLeft:`${100-size}%`,marginTop:"0px"}}>
           <Header size={size}/>
            <Outlet className="main__content"/>
     <div id="wrapper">
  <Chat chats={chat} ring={ring} />
  
  <div 
    className="chat-button-container"
    style={{
      position: "fixed",
      right: "30px",
      bottom: "30px",
      zIndex: 999,
    }}
  >
    {/* Ripple Effect Background */}
    <div 
      className="ripple-effect"
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: ring2 ? "120px" : "80px",
        height: ring2 ? "120px" : "80px",
        borderRadius: "50%",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        opacity: ring2 ? 0.3 : 0.6,
        transition: "all 0.8s ease",
        animation: ring2 ? "pulse 2s infinite" : "none",
      }}
    />
    
    {/* Main Chat Button */}
    <div
      className="support-btn"
      style={{
        position: "relative",
        width: "70px",
        height: "70px",
        borderRadius: "50%",
        cursor: "pointer",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        boxShadow: "0 8px 25px rgba(102, 126, 234, 0.4), 0 4px 12px rgba(0, 0, 0, 0.15)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        transform: chat ? "rotate(45deg)" : "rotate(0deg)",
        zIndex: 1000,
      }}
      onClick={() => {
        setChat((a) => !a);
        setRing2(false);
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = `${chat ? "rotate(45deg)" : "rotate(0deg)"} scale(1.1)`;
        e.target.style.boxShadow = "0 12px 35px rgba(102, 126, 234, 0.5), 0 6px 15px rgba(0, 0, 0, 0.2)";
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = `${chat ? "rotate(45deg)" : "rotate(0deg)"} scale(1)`;
        e.target.style.boxShadow = "0 8px 25px rgba(102, 126, 234, 0.4), 0 4px 12px rgba(0, 0, 0, 0.15)";
      }}
    >
      {/* Icon Container */}
      <div
        style={{
          width: "28px",
          height: "28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.3s ease",
        }}
      >
        {chat ? (
          // Close Icon (X)
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="white" 
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        ) : (
          // Chat Icon
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="white"
          >
            <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
          </svg>
        )}
      </div>
    </div>
    
    {/* Floating Label */}
    <div
      className="support-text"
      style={{
        position: "absolute",
        bottom: "80px",
        left: "50%",
        transform: "translateX(-50%)",
        background: "rgba(0, 0, 0, 0.8)",
        color: "white",
        padding: "8px 12px",
        borderRadius: "8px",
        fontSize: "13px",
        fontWeight: "500",
        whiteSpace: "nowrap",
        opacity: chat ? 1 : 0,
        visibility: chat ? "visible" : "hidden",
        transition: "all 0.3s ease",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      {chat ? "Đóng chat" : "Mở chat"}
      
      {/* Arrow pointing down */}
      <div
        style={{
          position: "absolute",
          top: "100%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 0,
          height: 0,
          borderLeft: "6px solid transparent",
          borderRight: "6px solid transparent",
          borderTop: "6px solid rgba(0, 0, 0, 0.8)",
        }}
      />
    </div>
    
    {/* Notification Badge */}
    {ring2 && !chat && (
      <div
        className="notification-badge"
        style={{
          position: "absolute",
          top: "8px",
          right: "8px",
          width: "20px",
          height: "20px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #ff6b6b, #ee5a24)",
          color: "white",
          fontSize: "11px",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          animation: "bounce 2s infinite",
          boxShadow: "0 2px 8px rgba(255, 107, 107, 0.4)",
        }}
      >
        !
      </div>
    )}
  </div>
</div>

<style>
{`
  @keyframes pulse {
    0% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 0.6;
    }
    50% {
      transform: translate(-50%, -50%) scale(1.2);
      opacity: 0.3;
    }
    100% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 0.6;
    }
  }
  
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-4px);
    }
    60% {
      transform: translateY(-2px);
    }
  }
  
  .chat-button-container:hover .support-text {
    opacity: 1 !important;
    visibility: visible !important;
  }
  
  .support-btn:active {
    transform: scale(0.95) !important;
  }
  
  /* Mobile responsive */
  @media (max-width: 768px) {
    .chat-button-container {
      right: 20px !important;
      bottom: 20px !important;
    }
    
    .support-btn {
      width: 60px !important;
      height: 60px !important;
    }
    
    .ripple-effect {
      width: 100px !important;
      height: 100px !important;
    }
  }
`}
</style>

        </div>
        
      </main>
 
    </>
  )
}

export default LayoutUser;