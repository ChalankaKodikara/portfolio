import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import bodyParser from "body-parser";
import multer from "multer";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: "20mb" }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ---------------------------------------------------------------------
// 📁 Folder setup
// ---------------------------------------------------------------------
const DATA_DIR = path.join(__dirname, "data");
const PROJECTS_DIR = path.join(DATA_DIR, "projects");
const EXPERIENCE_DIR = path.join(DATA_DIR, "experience");
const PHOTOS_DIR = path.join(DATA_DIR, "photos");
const COMMENTS_DIR = path.join(DATA_DIR, "comments");

const UPLOAD_PROJECTS = path.join(__dirname, "uploads", "projects");
const UPLOAD_EXPERIENCE = path.join(__dirname, "uploads", "experience");
const UPLOAD_PHOTOS = path.join(__dirname, "uploads", "photos");
const UPLOAD_COMMENTS = path.join(__dirname, "uploads", "comments");

// create folders if not exists
for (const dir of [DATA_DIR, COMMENTS_DIR, UPLOAD_COMMENTS]) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

for (const dir of [
  DATA_DIR,
  PROJECTS_DIR,
  EXPERIENCE_DIR,
  PHOTOS_DIR,
  UPLOAD_PROJECTS,
  UPLOAD_EXPERIENCE,
  UPLOAD_PHOTOS,
]) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// ---------------------------------------------------------------------
// ⚙️ Multer configuration — dynamic folders
// ---------------------------------------------------------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = UPLOAD_PROJECTS;
    if (req.originalUrl.includes("experience")) folder = UPLOAD_EXPERIENCE;
    else if (req.originalUrl.includes("photos")) folder = UPLOAD_PHOTOS;
    else if (req.originalUrl.includes("comments")) folder = UPLOAD_COMMENTS;

    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, "_");
    cb(null, `${Date.now()}-${safeName}`);
  },
});
const upload = multer({ storage });

// ---------------------------------------------------------------------
// 🧩 PROJECTS ENDPOINTS
// ---------------------------------------------------------------------
app.post("/api/projects", upload.single("image"), (req, res) => {
  try {
    const raw = req.body.data;
    if (!raw)
      return res.status(400).json({ success: false, message: "Missing data" });

    const data = JSON.parse(raw);
    const id = data.id || Date.now().toString();

    if (req.file) data.localImage = `/uploads/projects/${req.file.filename}`;

    fs.writeFileSync(
      path.join(PROJECTS_DIR, `${id}.json`),
      JSON.stringify({ ...data, id }, null, 2)
    );

    res.json({ success: true, id, image: data.localImage });
  } catch (err) {
    console.error("Error saving project:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get("/api/projects", (req, res) => {
  try {
    const files = fs.readdirSync(PROJECTS_DIR);
    const data = files.map((f) =>
      JSON.parse(fs.readFileSync(path.join(PROJECTS_DIR, f), "utf-8"))
    );
    res.json(data);
  } catch (err) {
    console.error("Error reading projects:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 📄 Get Single Project by ID
app.get("/api/projects/:id", (req, res) => {
  try {
    console.log("🔍 Requested project ID:", req.params.id);
    const filePath = path.join(PROJECTS_DIR, `${req.params.id}.json`);
    console.log("📁 Looking for file:", filePath);

    if (!fs.existsSync(filePath)) {
      console.warn("⚠️ File not found for ID:", req.params.id);
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    res.json(data);
  } catch (err) {
    console.error("Error reading project:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});


app.delete("/api/projects/:id", (req, res) => {
  try {
    const jsonPath = path.join(PROJECTS_DIR, `${req.params.id}.json`);
    if (!fs.existsSync(jsonPath))
      return res.status(404).json({ success: false });

    const data = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
    if (data.localImage) {
      const rel = data.localImage.replace(/^\/+/, "");
      const imgPath = path.join(__dirname, rel);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    fs.unlinkSync(jsonPath);
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting project:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ---------------------------------------------------------------------
// 🧩 EXPERIENCE ENDPOINTS
// ---------------------------------------------------------------------
app.post("/api/experience", upload.single("image"), (req, res) => {
  try {
    const raw = req.body.data;
    if (!raw)
      return res.status(400).json({ success: false, message: "Missing data" });

    const data = JSON.parse(raw);
    const id = data.id || Date.now().toString();

    if (req.file) data.companyLogo = `/uploads/experience/${req.file.filename}`;

    fs.writeFileSync(
      path.join(EXPERIENCE_DIR, `${id}.json`),
      JSON.stringify({ ...data, id }, null, 2)
    );

    res.json({ success: true, id, logo: data.companyLogo });
  } catch (err) {
    console.error("Error saving experience:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get("/api/experience", (req, res) => {
  try {
    const files = fs.readdirSync(EXPERIENCE_DIR);
    const data = files.map((f) =>
      JSON.parse(fs.readFileSync(path.join(EXPERIENCE_DIR, f), "utf-8"))
    );
    res.json(data);
  } catch (err) {
    console.error("Error reading experience:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete("/api/experience/:id", (req, res) => {
  try {
    const jsonPath = path.join(EXPERIENCE_DIR, `${req.params.id}.json`);
    if (!fs.existsSync(jsonPath))
      return res.status(404).json({ success: false });

    const data = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
    if (data.companyLogo) {
      const rel = data.companyLogo.replace(/^\/+/, "");
      const imgPath = path.join(__dirname, rel);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    fs.unlinkSync(jsonPath);
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting experience:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ---------------------------------------------------------------------
// 🧩 PHOTOS (NEWSPAPER) ENDPOINTS
// ---------------------------------------------------------------------
app.post("/api/photos", upload.single("image"), (req, res) => {
  try {
    const raw = req.body.data;
    if (!raw)
      return res.status(400).json({ success: false, message: "Missing data" });

    const data = JSON.parse(raw);
    const id = data.id || Date.now().toString();

    if (req.file) data.localImage = `/uploads/photos/${req.file.filename}`;

    fs.writeFileSync(
      path.join(PHOTOS_DIR, `${id}.json`),
      JSON.stringify({ ...data, id }, null, 2)
    );

    res.json({ success: true, id, image: data.localImage });
  } catch (err) {
    console.error("Error saving photo:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get("/api/photos", (req, res) => {
  try {
    const files = fs.readdirSync(PHOTOS_DIR);
    const data = files.map((f) =>
      JSON.parse(fs.readFileSync(path.join(PHOTOS_DIR, f), "utf-8"))
    );
    res.json(data);
  } catch (err) {
    console.error("Error reading photos:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete("/api/photos/:id", (req, res) => {
  try {
    const jsonPath = path.join(PHOTOS_DIR, `${req.params.id}.json`);
    if (!fs.existsSync(jsonPath))
      return res.status(404).json({ success: false });

    const data = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
    if (data.localImage) {
      const rel = data.localImage.replace(/^\/+/, "");
      const imgPath = path.join(__dirname, rel);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    fs.unlinkSync(jsonPath);
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting photo:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ---------------------------------------------------------------------
// 🧩 COMMENTS ENDPOINTS
// ---------------------------------------------------------------------

// ➕ Create Comment
app.post("/api/comments", upload.single("image"), (req, res) => {
  try {
    const raw = req.body.data;
    if (!raw)
      return res.status(400).json({ success: false, message: "Missing data" });

    const data = JSON.parse(raw);
    const id = data.id || Date.now().toString();

    if (req.file) data.localImage = `/uploads/comments/${req.file.filename}`;

    const filePath = path.join(COMMENTS_DIR, `${id}.json`);
    fs.writeFileSync(filePath, JSON.stringify({ ...data, id }, null, 2));

    console.log(
      `🖼️ Saved comment image at: ${UPLOAD_COMMENTS}/${
        req.file?.filename || "no image"
      }`
    );
    res.json({ success: true, id, image: data.localImage });
  } catch (err) {
    console.error("❌ Error saving comment:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 📖 Get All Comments
app.get("/api/comments", (req, res) => {
  try {
    const files = fs.readdirSync(COMMENTS_DIR);
    const data = files.map((f) =>
      JSON.parse(fs.readFileSync(path.join(COMMENTS_DIR, f), "utf-8"))
    );
    res.json(data);
  } catch (err) {
    console.error("❌ Error reading comments:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 🗑️ Delete Comment
app.delete("/api/comments/:id", (req, res) => {
  try {
    const jsonPath = path.join(COMMENTS_DIR, `${req.params.id}.json`);
    if (!fs.existsSync(jsonPath))
      return res.status(404).json({ success: false, message: "Not found" });

    const data = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
    if (data.localImage) {
      const rel = data.localImage.replace(/^\/+/, "");
      const imgPath = path.join(__dirname, rel);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    fs.unlinkSync(jsonPath);
    res.json({ success: true });
  } catch (err) {
    console.error("❌ Error deleting comment:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ---------------------------------------------------------------------
// 🚀 Start Server
// ---------------------------------------------------------------------
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
