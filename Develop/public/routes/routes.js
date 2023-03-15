const fs = require('fs');
const path = require('path');

function setupNotesAPI(app) {
  fs.readFile('db/db.json', 'utf8', (err, data) => {
    if (err) throw err;

    const notes = JSON.parse(data);

    app.get('/api/notes', function(req, res) {
      res.json(notes);
    });

    app.post('/api/notes', function(req, res) {
      const newNote = req.body;
      notes.push(newNote);
      updateNotesFile();
      return res.status(201).json(newNote);
    });

    app.get('/api/notes/:id', function(req, res) {
      const noteId = parseInt(req.params.id);
      const note = notes.find(n => n.id === noteId);
      if (!note) {
        return res.status(404).json({error: 'Note not found'});
      }
      res.json(note);
    });

    app.delete('/api/notes/:id', function(req, res) {
      const noteId = parseInt(req.params.id);
      const noteIndex = notes.findIndex(n => n.id === noteId);
      if (noteIndex === -1) {
        return res.status(404).json({error: 'Note not found'});
      }
      notes.splice(noteIndex, 1);
      updateNotesFile();
      res.sendStatus(204);
    });

    app.get('/notes', function(req, res) {
      res.sendFile(path.join(__dirname, '../public/notes.html'));
    });

    function updateNotesFile() {
      fs.writeFile('db/db.json', JSON.stringify(notes, null, 2), err => {
        if (err) throw err;
      });
    }
  });
}

module.exports = setupNotesAPI;