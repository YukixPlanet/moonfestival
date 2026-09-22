const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 8080;
const HOST = "0.0.0.0";
const DATA_FILE = process.env.DATA_FILE || path.join(__dirname, "local-data.json");

function readData(){
  try { return fs.readFileSync(DATA_FILE, "utf-8"); } catch (e) { return null; }
}

function writeData(v){
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, v);
}

app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/data", (req, res) => {
  try {
    const raw = readData();
    res.json({ data: raw ? JSON.parse(raw) : null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "read failed" });
  }
});

app.put("/api/data", (req, res) => {
  try {
    writeData(JSON.stringify(req.body));
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "write failed" });
  }
});

app.listen(PORT, HOST, () => console.log(`Server running on ${HOST}:${PORT}, data file: ${DATA_FILE}`));
