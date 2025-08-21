import express from "express";
import fs from "fs";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(".")); // serve index.html and admin.html

const DATA_FILE = "./properties.json";

// Ensure file exists
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

// Get all properties
app.get("/api/properties", (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  res.json(data);
});

// Add new property
app.post("/api/properties", (req, res) => {
  const newProperty = { id: Date.now(), ...req.body };
  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  data.push(newProperty);
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  res.json({ success: true, property: newProperty });
});

// Delete property
app.delete("/api/properties/:id", (req, res) => {
  let data = JSON.parse(fs.readFileSync(DATA_FILE));
  data = data.filter(p => p.id != req.params.id);
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  res.json({ success: true });
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
