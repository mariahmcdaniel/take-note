const fs = require("fs");
// const path = require("path"):
// const dbFilePath = path.join(__dirname, "./db/db.json");

/**
 *  Function to write data to the JSON file given a destination and some content
 *  @param {string} destination The file you want to write to.
 *  @param {object} content The content you want to write to the file.
 *  @returns {void} Nothing
 */
const writeToFile = (destination, content) =>
  fs.writeFileSync(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  );

/**
 *  Function to read data from a given a file and append some content
 *  @param {object} content The content you want to append to the file.
 *  @param {string} file The path to the file you want to save to.
 *  @returns {void} Nothing
 */
const readAndAppend = (content, file) => {
  const data = fs.readFileSync(file, "utf8");
  if (data) {
    const parsedData = JSON.parse(data);
    parsedData.push(content);
    writeToFile(file, parsedData);
  }
};

/**
 * Function to remove content from the JSON file given an id and the current content
 * @param {object} data The content you want to remove from
 * @param {string} id The unique id of the piece of content that you want to remove
 * @returns {void} Nothing
 */
const deleteNote = (data, id, file) => {
  let filtered = data.filter((note) => note.id !== id);
  writeToFile(file, filtered);
};

module.exports = { writeToFile, readAndAppend, deleteNote };
