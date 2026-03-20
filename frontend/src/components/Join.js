import React, { useState } from "react";

function Join({ setUsername, setRoom, setShowChat }) {
  const [name, setName] = useState("");
  const [roomId, setRoomId] = useState("");

  const joinChat = () => {
    if (name !== "" && roomId !== "") {
      setUsername(name);
      setRoom(roomId);
      setShowChat(true);
    }
  };

  return (
    <div className="joinContainer">
      <h2>Join Chat</h2>

      <input
        placeholder="Username..."
        onChange={(e) => setName(e.target.value)}
      />

      <input
        placeholder="Room ID..."
        onChange={(e) => setRoomId(e.target.value)}
      />

      <button onClick={joinChat}>Join</button>
    </div>
  );
}

export default Join;