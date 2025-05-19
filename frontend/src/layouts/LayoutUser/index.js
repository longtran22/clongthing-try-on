import { Outlet } from "react-router-dom";
import Header from "../../components/Header";
import Sidebar from "../../components/SidebarUser";
import React, { useState,useEffect } from "react";
import help from "../../../src/components/introduce/img/help.png"
// import Chat from "../../../src/pages/Home/chat"
import "../LayoutUser/index.css"
function LayoutUser(){
const [size,formSize]=useState(80)
// const [chat,setChat]=useState(false)
const [ring2,setRing2]=useState(false)
const change=()=>{
  formSize((a)=>{if(a==80) return 96;else return 80});
}
const ring=()=>{
setRing2(true);
  
}
  return(
    <>
      <Header size={size}/>
      <main>
        <Sidebar change={change}/>
        <div style={{width:`${size}%`,marginLeft:`${100-size}%`,marginTop:"82px"}}>
<Outlet className="main__content"/>

        </div>
        
      </main>
 
    </>
  )
}

export default LayoutUser;