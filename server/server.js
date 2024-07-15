require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require('morgan');
const path = require('path');

const authRoutes = require("./routes/authRoutes");
const friendInvitationRoutes = require("./routes/friendInvitationRoutes");
const groupChatRoutes = require("./routes/groupChatRoutes")

const { createSocketServer } = require("./socket/socketServer");

const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));

// register the routes
app.use("/api/auth", authRoutes);
app.use("/api/invite-friend", friendInvitationRoutes);
app.use("/api/group-chat", groupChatRoutes);

const server = http.createServer(app);

// socket connection
createSocketServer(server);

const MONGO_URI =
    process.env.NODE_ENV === "development"
        ? process.env.MONGO_URI
        : process.env.MONGO_URI_DEV;

app.use(express.static(path.join(__dirname, "../client/build")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client", "build", "index.html"));
});

mongoose
    .connect(MONGO_URI)
    .then(() => {

        server.listen(PORT, () => {
            console.log(`SERVER STARTED ON ${PORT}.....!`);
        });
    })
    .catch((err) => {
        console.log("database connection failed. Server not started");
        console.error(err);
    });
