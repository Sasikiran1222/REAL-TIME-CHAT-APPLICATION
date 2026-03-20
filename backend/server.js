const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const Message = require("./models/Message");

const app = express();
app.use(cors());

// MongoDB
mongoose.connect("mongodb+srv://chatuser:chat123@mydb.kbl3wrm.mongodb.net/chat-app?retryWrites=true&w=majority")
  .then(() => console.log("MongoDB Atlas connected ✅"))
  .catch((err) => console.log(err));
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// prevent duplicate join
let joinedUsers = {};

io.on("connection", (socket) => {
  // JOIN + LOAD HISTORY
  socket.on("join_room", async ({ username, room }) => {
    if (joinedUsers[socket.id]) return;
    joinedUsers[socket.id] = true;

    socket.join(room);

    const messages = await Message.find({ room });
    socket.emit("load_messages", messages);

    socket.to(room).emit("receive_message", {
      author: "System",
      message: `${username} joined the chat`,
      time: new Date().toLocaleTimeString(),
    });
  });

  // SEND MESSAGE
  socket.on("send_message", async (data) => {
    await new Message(data).save();
    io.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    delete joinedUsers[socket.id];
  });
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});