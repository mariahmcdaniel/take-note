const express = require("express");
const PORT = process.env.PORT || 3001;
const path = require("path");
const fs = require("fs");
// const dataBase = require("./db/db.json");
const uuid = require("./helpers/uuid");
const dbFilePath = path.join(__dirname, "./db/db.json");

const { readAndAppend, deleteNote } = require("./helpers/file");

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
  const retrievedData = fs.readFileSync(dbFilePath, "utf8");
  res.json(JSON.parse(retrievedData));
});

app.post("/api/notes", (req, res) => {
  console.info(`${req.method} request received to add a note`);

  const { title, text } = req.body;

  if (req.body) {
    const newNote = {
      title,
      text,
      id: uuid(),
    };

    readAndAppend(newNote, "./db/db.json");
    res.json("Your note has been saved!");
  } else {
    res.error("An error occured while attempting to save your note");
  }
});

app.delete("/api/notes/:id", (req, res) => {
  console.info(`${req.method} request received to remove a note`);
  const { id } = req.params;
  const retrievedData = fs.readFileSync(dbFilePath, "utf8");
  const parsedData = JSON.parse(retrievedData);
  deleteNote(parsedData, id, dbFilePath);
  console.info(`A note has been removed - id:${id}`);
  res.send();
});

app.listen(PORT, () => {
  console.log(`app listening at http://localhost:${PORT}`);
});
