//List of dependencies
const express = require('express');
const fs = require('fs');
const path = require('path');

//set up express app
const app = express();
const PORT = process.env.PORT || 3001;

//access images, css, js files in the public dir
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

//GET route for the notes.html
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
})

//GET route for the db.json
app.get('/api/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './db/db.json'));
})

//GET route for the index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
})

//POST route
app.post('/api/notes', (req, res) => {
    const dataNote = req.body;
    const parseNote = JSON.parse(fs.readFileSync('./db/db.json', "utf-8"));
    const noteLength = (parseNote.length).toString();

    //we need an id property, it is based on length and assigned to each json obj
    dataNote.id = noteLength;
    parseNote.push(dataNote);

    //we need to write the updated data to the dbjson
    fs.writeFileSync('./db/db.json', JSON.stringify(parseNote));
    res.json(parseNote);
})

//DELETE route by id
app.delete('/api/notes/:id', (req, res) => {
    const parseNote = JSON.parse(fs.readFileSync('./db/db.json', "utf-8"));
    const noteId = (req.params.id).toString();

    //we need to save the notes without matching id, and only matching id ones will delete
    parseNote = parseNote.filter(selected => {
        return selected.id != noteId;
    })

    //we need to display the updated note, and write it to db.json
    fs.writeFileSync('./db/db.json', JSON.stringify(parseNote));
    res.json(parseNote);
})

//we need to listen to the port once it deploys
app.listen(PORT, () => console.log("Server is listening on Port " + PORT));