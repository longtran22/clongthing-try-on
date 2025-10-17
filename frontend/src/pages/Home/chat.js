import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { useAuth } from "../../components/introduce/useAuth";
import { IoCallSharp } from "react-icons/io5";
import { FaVideo } from "react-icons/fa";

function Chat({chats,ring}) {
  const { user, loading } = useAuth();
  const chatEndRef = useRef(null);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const messageHandled = useRef(false);
    const socket = io("http://localhost:5000");
  useEffect(() => {


    const fetchMessages = async () => {
      if (loading) return;
      try {
        console.log("body ueer",JSON.stringify({user}))
        const response = await fetch("http://localhost:5000/chat/getMessages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({user}),
        });
        const data = await response.json();
        console.log("data",data)
        if (Array.isArray(data)) {
          const formattedData = data.map((msg) => ({
            ...msg,
            isUser: msg.sender?._id === user._id,
          }));
          setChat(formattedData);
        }
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    fetchMessages();
      
    // socket.on("receive_message", (data) => {
    //   console.log(!messageHandled.current)
    //   console.log(data.sender._id !== user._id)
    //   if(!messageHandled.current&&data.sender._id !== user._id){
    //     messageHandled.current = true;
        
    //     const newMessage = {
    //     ...data,
    //     isUser: data.sender._id === user._id,
    //   };
    //   console.log("day la chat ",chats)
    //   if(!chats){ring()}
    //   setChat((prev) => [...prev, newMessage]);
    //   setTimeout(() => {
    //     messageHandled.current = false;  // Đặt lại để xử lý tin nhắn mới
    //   }, 1000); // Ví dụ reset sau 1 giây
    //   }
      
    // });

    // // Cleanup khi component unmount
    // return () => {
    //   socket.disconnect();
    // };

  }, [loading, user]);
  useEffect(()=>{
    socket.on("receive_message", (data) => {
      console.log(!messageHandled.current)
      console.log(data.sender._id !== user._id)
      if(!messageHandled.current&&data.sender._id !== user._id){
        messageHandled.current = true;
        
        const newMessage = {
        ...data,
        isUser: data.sender._id === user._id,
      };
      console.log("day la chat ",chats)
      if(!chats){ring()}
      setChat((prev) => [...prev, newMessage]);
      setTimeout(() => {
        messageHandled.current = false;  // Đặt lại để xử lý tin nhắn mới
      }, 1000); // Ví dụ reset sau 1 giây
      }
      
    });

    // Cleanup khi component unmount
    return () => {
      socket.disconnect();
    };
  },[ring])
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);
  const sendMessage = () => {
    if (message.trim() !== "") {
      const newMessage = {
        sender: user,
        owner: user.id_owner,
        content: message,
      };
  
      socket.emit("send_message", newMessage);
  
      setChat((prev) => [
        ...prev,
        {
          ...{sender:user,
            content:message
          },
          isUser: true,
        },
      ]);
  
      setMessage(""); // Xóa nội dung tin nhắn sau khi gửi
    }
  };
  
  return (
    // <div style={{ ...styles.container, display: chats ? "block" : "none" }}>
    //   {/* Header */}
    //   <div style={styles.header}>
    //     <div style={styles.headerLeft}>
    //       <img src={user?.avatar} alt="Avatar" style={styles.headerAvatar} />
    //       <span style={styles.headerName}>{user?.name || "Chat"}</span>
    //     </div>
    //     <div style={styles.headerRight}>
    //       <button style={styles.headerButton}><IoCallSharp /></button>
    //       <button style={styles.headerButton}><FaVideo />
    //       </button>
    //     </div>
    //   </div>
    //   {/* Chat Window */}
    //   <div style={styles.chatWindow}>
    //     {chat.map((msg, index) => (
    //       <div
    //         key={index}
    //         style={{
    //           ...styles.messageContainer,
    //           justifyContent: msg.isUser ? "flex-end" : "flex-start",
    //         }}
    //       >
    //         {!msg.isUser && (
    //        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
    //           <img src={msg.sender.avatar} alt="Avatar" style={styles.avatar} />
    //           <span>{msg.sender.name}</span>
    //         </div>

    //         )}
    //         <div
    //           style={{
    //             ...styles.message,
    //             backgroundColor: msg.isUser ? "#d1e7ff" : "#e1ffc7",
    //           }}
    //         >
    //           {msg.content}
    //         </div>
    //         {msg.isUser && (
    //           <img src={msg.sender.avatar} alt="Avatar" style={styles.avatar} />
    //         )}
    //       </div>
    //     ))}
    //     <div ref={chatEndRef} />
    //   </div>
    //   {/* Input Field */}
    //   <div style={styles.inputContainer}>
    //     <input
    //       type="text"
    //       value={message}
    //       onChange={(e) => setMessage(e.target.value)}
    //       placeholder="Type a message..."
    //       style={styles.input}
    //     />
    //     <button onClick={sendMessage} style={styles.button}>
    //       Send
    //     </button>
    //   </div>
    // </div>
    <div style={{ ...styles.container, display: chats ? "block" : "none" }}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.avatarContainer}>
            <img src={user?.avatar} alt="Avatar" style={styles.headerAvatar} />
            <div style={styles.onlineIndicator}></div>
          </div>
          <div style={styles.userInfo}>
            <span style={styles.headerName}>{user?.name || "Chat"}</span>
            <span style={styles.status}>Online</span>
          </div>
        </div>
        <div style={styles.headerRight}>
          <button style={styles.headerButton}><IoCallSharp /></button>
          <button style={styles.headerButton}><FaVideo /></button>
          {/* <button style={styles.closeButton} onClick={() => {chats=false}}>×</button> */}
        </div>
      </div>
    
      {/* Chat Window */}
      <div style={styles.chatWindow}>
        {Array.isArray(chat) && chat.map((msg, index) => (
          <div
            key={index}
            style={{
              ...styles.messageContainer,
              justifyContent: msg.isUser ? "flex-end" : "flex-start",
            }}
          >
            {/* {!msg.isUser && (
              <div style={styles.senderInfo}>
                <img src={msg.sender.avatar} alt="Avatar" style={styles.avatar} />
                <span> {msg.sender.name} </span>
              </div>
            )} */}
            {!msg.isUser && msg.sender && (
              <div style={styles.senderInfo}>
                <img
                  src={msg.sender?.avatar || "/default-avatar.png"}
                  alt="Avatar"
                  style={styles.avatar}
                />
                <span>{msg.sender?.name || "Unknown"}</span>
              </div>
            )}

            <div style={styles.messageWrapper}>
              <div
                style={{
                  ...styles.message,
                  ...(msg.isUser ? styles.userMessage : styles.otherMessage),
                }}
              >
                {msg.content}
              </div>
              <div style={styles.messageTime}>
                {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </div>
            </div>
            {msg.isUser && (
              <div style={styles.senderInfo}>
                <img src={msg.sender.avatar} alt="Avatar" style={styles.avatar} />
              </div>
            )}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
     
      {/* Input Field */}
      <div style={styles.inputContainer}>
        <div style={styles.inputWrapper}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            style={styles.input}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button onClick={sendMessage} style={styles.sendButton}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2,21L23,12L2,3V10L17,12L2,14V21Z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
  
}

const styles = {
  container: {
    width: "360px",
    height: "550px",
    margin: "10px auto",
    borderRadius: "16px",
    overflow: "hidden",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    position: "fixed",
    right: "20px",
    bottom: "90px",
    zIndex: 1000,
    backgroundColor: "#ffffff",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15), 0 8px 25px rgba(0, 0, 0, 0.1)",
    border: "1px solid rgba(0, 0, 0, 0.08)",
    display: "flex",
    flexDirection: "column",
  },
  
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 20px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    minHeight: "70px",
    flexShrink: 0, // Thêm dòng này để header không bị co lại
    position: "relative", // Thêm dòng này
    zIndex: 10, // Thêm dòng này để header luôn ở trên
  },
  
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  
  avatarContainer: {
    position: "relative",
  },
  
  headerAvatar: {
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    border: "3px solid rgba(255, 255, 255, 0.3)",
    objectFit: "cover",
  },
  
  onlineIndicator: {
    position: "absolute",
    bottom: "2px",
    right: "2px",
    width: "12px",
    height: "12px",
    backgroundColor: "#4ade80",
    borderRadius: "50%",
    border: "2px solid #fff",
  },
  
  userInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  
  headerName: {
    fontSize: "16px",
    fontWeight: "600",
    margin: 0,
  },
  
  status: {
    fontSize: "12px",
    opacity: 0.8,
    fontWeight: "400",
  },
  
  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  
  headerButton: {
    width: "36px",
    height: "36px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    transition: "all 0.2s ease",
    backdropFilter: "blur(10px)",
  },
  
  closeButton: {
    width: "28px",
    height: "28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "18px",
    fontWeight: "bold",
    transition: "all 0.2s ease",
  },
  
  chatWindow: {
    flex: 1,
    overflowY: "auto",
    padding: "20px 16px",
    backgroundColor: "#f8fafc",
    backgroundImage: "radial-gradient(circle at 25px 25px, rgba(255,255,255,0.15) 2%, transparent 2%), radial-gradient(circle at 75px 75px, rgba(255,255,255,0.1) 2%, transparent 2%)",
    backgroundSize: "100px 100px",
    // Thêm các thuộc tính này để đảm bảo chatWindow chiếm đúng không gian
    minHeight: 0, // Quan trọng: cho phép flex item co lại
    height: "calc(100% - 90px - 84px)", // 70px cho header, 84px cho input container
    position: "relative",
    
    // Tùy chỉnh thanh cuộn
    scrollbarWidth: "thin",
    scrollbarColor: "#cbd5e1 transparent",
  },
  
  messageContainer: {
    display: "flex",
    alignItems: "flex-end",
    marginBottom: "16px",
    gap: "8px",
  },
  
  senderInfo: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  
  avatar: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid #e2e8f0",
  },
  
  messageWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    maxWidth: "240px",
  },
  
  message: {
    padding: "12px 16px",
    borderRadius: "18px",
    fontSize: "14px",
    lineHeight: "1.4",
    wordWrap: "break-word",
    position: "relative",
  },
  
  userMessage: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    borderBottomRightRadius: "6px",
    marginLeft: "auto",
  },
  
  otherMessage: {
    backgroundColor: "#ffffff",
    color: "#374151",
    border: "1px solid #e5e7eb",
    borderBottomLeftRadius: "6px",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
  },
  
  messageTime: {
    fontSize: "11px",
    color: "#9ca3af",
    textAlign: "right",
    opacity: 0.7,
  },
  
  inputContainer: {
    padding: "16px 20px 20px",
    backgroundColor: "#ffffff",
    borderTop: "1px solid #e5e7eb",
    flexShrink: 0, // Thêm dòng này để input container không bị co lại
    position: "relative", // Thêm dòng này
    zIndex: 10, // Thêm dòng này để input container luôn ở trên
  },
  
  inputWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "8px 12px",
    backgroundColor: "#f8fafc",
    borderRadius: "24px",
    border: "1px solid #e2e8f0",
    transition: "all 0.2s ease",
  },
  
  input: {
    flex: 1,
    padding: "8px 4px",
    fontSize: "14px",
    border: "none",
    backgroundColor: "transparent",
    outline: "none",
    color: "#374151",
  },
  
  sendButton: {
    width: "36px",
    height: "36px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    cursor: "pointer",
    transition: "all 0.2s ease",
    flexShrink: 0,
  },
};
export default Chat;

