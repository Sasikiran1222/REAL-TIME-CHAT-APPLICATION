import React, { useEffect, useState, useRef } from "react";

function Chat({ socket, username, room }) {
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    socket.emit("join_room", { username, room });

    socket.off("receive_message");
    socket.off("load_messages");

    socket.on("load_messages", (msgs) => {
      setMessageList(msgs);
    });

    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });

    // eslint-disable-next-line
  }, []);

  const sendMessage = () => {
    if (message !== "") {
      const msgData = {
        room,
        author: username,
        message,
        time: new Date().toLocaleTimeString(),
      };

      socket.emit("send_message", msgData);
      setMessage("");
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageList]);

  return (
    <div className="chatContainer">
      <div className="chatHeader">Room: {room}</div>

      <div className="chatBody">
        {messageList.map((msg, i) => (
          <div key={i} className={username === msg.author ? "myMsg" : "otherMsg"}>
            <p>{msg.message}</p>
            <span>{msg.time}</span>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="chatFooter">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Chat;