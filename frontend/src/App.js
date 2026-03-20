import React, { useState } from "react";
import io from "socket.io-client";
import "./App.css";
import Join from "./components/Join";
import Chat from "./components/Chat";

const socket = io("http://localhost:5000");

function App() {
  const [showChat, setShowChat] = useState(false);
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");

  return (
    <div>
      {!showChat ? (
        <Join 
          setUsername={setUsername} 
          setRoom={setRoom} 
          setShowChat={setShowChat} 
        />
      ) : (
        <Chat 
          socket={socket} 
          username={username} 
          room={room} 
        />
      )}
    </div>
  );
}

export default App;