// Your Task
// Your assignment is to modify starter code to create an application called Note Taker that can be used to write and save notes. This application will use an Express.js back end and will save and retrieve note data from a JSON file.

// The application’s front end has already been created. It's your job to build the back end, connect the two, and then deploy the entire application to Heroku.

// User Story
// AS A small business owner
// I WANT to be able to write and save notes
// SO THAT I can organize my thoughts and keep track of tasks I need to complete
// Acceptance Criteria
// GIVEN a note-taking application
// WHEN I open the Note Taker
// THEN I am presented with a landing page with a link to a notes page
// WHEN I click on the link to the notes page
// THEN I am presented with a page with existing notes listed in the left-hand column, plus empty fields to enter a new note title and the note’s text in the right-hand column
// WHEN I enter a new note title and the note’s text
// THEN a Save icon appears in the navigation at the top of the page
// WHEN I click on the Save icon
// THEN the new note I have entered is saved and appears in the left-hand column with the other existing notes
// WHEN I click on an existing note in the list in the left-hand column
// THEN that note appears in the right-hand column
// WHEN I click on the Write icon in the navigation at the top of the page
// THEN I am presented with empty fields to enter a new note title and the note’s text in the right-hand column

const express = require("express");
const PORT = process.env.PORT || 3001;
const path = require("path");
const fs = require("fs");
const dataBase = require("./db/db.json");
const uuid = require("./helpers/uuid");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/api/notes", (req, res) => {
  console.info(`${req.method} request received for notes`);
  const dbFilePath = path.join(__dirname, "./db/db.json");
  const retrievedData = fs.readFileSync(dbFilePath, "utf8");
  res.json(JSON.parse(retrievedData));
});

const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 2), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  );

const readAndAppend = (content, file) => {
  fs.readFile(file, "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedData = JSON.parse(data);
      parsedData.push(content);
      writeToFile(file, parsedData);
    }
  });
};

app.post("/api/notes", (req, res) => {
  console.info(`${req.method} request received to add a note`);

  const { title, text } = req.body;

  if (req.body) {
    const newNote = {
      title,
      text,
      note_id: uuid(),
    };

    readAndAppend(newNote, "./db/db.json");
    res.json("Your note has been saved!");
  } else {
    res.error("An error occured while attempting to save your note");
  }
});

app.delete("/api/notes", (req, res) => {
  console.info(`${req.method} request received to remove a note`);
  const noteId = req.body.note_id;
  const dbFilePath = path.join(__dirname, "./db/db.json");
  const retrievedData = fs.readFileSync(dbFilePath, "utf8");
  console.log(retrievedData);
  console.log(noteId);
});

app.listen(PORT, () => {
  console.log(`app listening at http://localhost:${PORT}`);
});
