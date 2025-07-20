const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const documentRoutes = require('./routes/document');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});


mongoose.connect(process.env.MONGO_URI);
mongoose.connection
    .on('open', () => console.log('MongoDB Connected...'))
    .on('error', (err) => { console.log(err.message); process.exit(1); });

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('join-document', ({ documentId, username }) => {
        socket.join(documentId);
        socket.documentId = documentId; 
        socket.username = username;   

        if (!activeUsers.has(documentId)) {
            activeUsers.set(documentId, new Set());
        }
        activeUsers.get(documentId).add(username);

        io.to(documentId).emit('active-users-update', Array.from(activeUsers.get(documentId)));
        console.log(`Client ${username} joined document: ${documentId}`);
    });

    socket.on('code-change', (data) => {
        socket.to(data.documentId).emit('receive-code-change', data.code);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
        if (socket.documentId && socket.username) {
            const usersInDoc = activeUsers.get(socket.documentId);
            if (usersInDoc) {
                usersInDoc.delete(socket.username);
                io.to(socket.documentId).emit('active-users-update', Array.from(usersInDoc));
                if (usersInDoc.size === 0) {
                    activeUsers.delete(socket.documentId);
                }
            }
        }
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
