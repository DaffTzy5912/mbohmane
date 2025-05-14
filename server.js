const express = require('express');
const fs = require('fs');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const cors = require('cors');
const path = require('path');

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const DB_PATH = './database.json';

function readDB() {
  return JSON.parse(fs.readFileSync(DB_PATH));
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// Register user
app.post('/register', (req, res) => {
  const { name, number } = req.body;
  const db = readDB();
  const exists = db.users.find(u => u.number === number);
  if (exists) return res.status(400).send({ error: 'Number already used' });

  db.users.push({ name, number, bio: '', photo: '', contacts: [] });
  writeDB(db);
  res.send({ success: true });
});

// Login
app.get('/user/:number', (req, res) => {
  const db = readDB();
  const user = db.users.find(u => u.number === req.params.number);
  if (!user) return res.status(404).send({ error: 'Not found' });
  res.send(user);
});

// Update profile
app.post('/updateProfile', (req, res) => {
  const { number, name, bio } = req.body;
  const db = readDB();
  const user = db.users.find(u => u.number === number);
  if (!user) return res.status(404).send({ error: 'User not found' });

  user.name = name;
  user.bio = bio;
  writeDB(db);
  res.send({ success: true });
});

// Get all other users (for chat list)
app.get('/chats/:number', (req, res) => {
  const { number } = req.params;
  const db = readDB();
  const users = db.users.filter(u => u.number !== number);
  res.send(users);
});

// Add contact
app.post('/addContact', (req, res) => {
  const { owner, number, name } = req.body;
  const db = readDB();
  const user = db.users.find(u => u.number === owner);
  if (!user) return res.status(404).send({ error: 'Owner not found' });

  if (!user.contacts.some(c => c.number === number)) {
    user.contacts.push({ number, name });
  }
  writeDB(db);
  res.send({ success: true });
});

// Search contacts
app.get('/searchContact', (req, res) => {
  const { owner, q } = req.query;
  const db = readDB();
  const user = db.users.find(u => u.number === owner);
  if (!user) return res.status(404).send({ error: 'Owner not found' });

  const results = user.contacts.filter(c =>
    c.name.toLowerCase().includes(q.toLowerCase()) || c.number.includes(q)
  );
  res.send(results);
});

// Get chat history between two users
app.get('/messages/:from/:to', (req, res) => {
  const db = readDB();
  const { from, to } = req.params;
  const messages = db.messages.filter(m =>
    (m.from === from && m.to === to) || (m.from === to && m.to === from)
  );
  res.send(messages);
});

// Socket.IO
io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('chat', (data) => {
    const db = readDB();

    // Simpan pesan ke database
    db.messages.push({
      from: data.from,
      to: data.to,
      text: data.text || null,
      image: data.image || null,
      time: Date.now()
    });

    writeDB(db);
    io.emit('chat', data); // Kirim ke semua client
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});