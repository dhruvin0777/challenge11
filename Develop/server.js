// Import dependencies
const express = require('express');
const path = require('path');
const fs = require('fs');

// Set up the app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => res.sendFile(path.join(__dirname, './public/index.html')));
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, './public/notes.html')));
app.get('/api/notes', (req, res) => res.json(fs.readFileSync(path.join(__dirname, './db/db.json'), 'utf8')));
app.post('/api/notes', (req, res) => {
  const notes = JSON.parse(fs.readFileSync(path.join(__dirname, './db/db.json'), 'utf8'));
  const newNote = { ...req.body, id: notes.length + 1 };
  notes.push(newNote);
  fs.writeFileSync(path.join(__dirname, './db/db.json'), JSON.stringify(notes, null, 2));
  res.json(newNote);
});
app.delete('/api/notes/:id', (req, res) => {
  const notes = JSON.parse(fs.readFileSync(path.join(__dirname, './db/db.json'), 'utf8'));
  const updatedNotes = notes.filter(note => note.id !== parseInt(req.params.id));
  fs.writeFileSync(path.join(__dirname, './db/db.json'), JSON.stringify(updatedNotes, null, 2));
  res.json({ success: true });
});
app.get('*', (req, res) => res.sendFile(path.join(__dirname, './public/index.html')));

// Start the server
app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
