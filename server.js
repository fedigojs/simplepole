const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");

const DATA_PATH = path.join(__dirname, "public", "data.json");

app.use(express.static("public"));

app.get("/", (req, res) => {
  fs.readFile(DATA_PATH, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Server Error");
    } else {
      res.setHeader("Content-Type", "application/json");
      res.send(data);
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server start on port ${PORT}`);
});
