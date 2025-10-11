import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import bodyParser from "body-parser";
import multer from "multer";
import { fileURLToPath } from "url";
import sharp from "sharp";
import heicConvert from "heic-convert";

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
const HERO_FILE = path.join(DATA_DIR, "hero.json");
const GRAPHICS_DIR = path.join(DATA_DIR, "graphics"); // ✅ added

const UPLOAD_PROJECTS = path.join(__dirname, "uploads", "projects");
const UPLOAD_EXPERIENCE = path.join(__dirname, "uploads", "experience");
const UPLOAD_PHOTOS = path.join(__dirname, "uploads", "photos");
const UPLOAD_COMMENTS = path.join(__dirname, "uploads", "comments");
const UPLOAD_HERO = path.join(__dirname, "uploads", "hero");
const UPLOAD_GRAPHICS = path.join(__dirname, "uploads", "graphics"); // ✅ added

// create folders if not exists
for (const dir of [
  DATA_DIR,
  PROJECTS_DIR,
  EXPERIENCE_DIR,
  PHOTOS_DIR,
  COMMENTS_DIR,
  UPLOAD_PROJECTS,
  UPLOAD_EXPERIENCE,
  UPLOAD_PHOTOS,
  UPLOAD_COMMENTS,
  UPLOAD_HERO,
  GRAPHICS_DIR,
  UPLOAD_GRAPHICS,
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
    else if (req.originalUrl.includes("hero")) folder = UPLOAD_HERO;
    else if (req.originalUrl.includes("graphics")) folder = UPLOAD_GRAPHICS; // ✅ added

    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, "_");
    cb(null, `${Date.now()}-${safeName}`);
  },
});
const upload = multer({ storage });

// ---------------------------------------------------------------------
// 🦸 HERO SECTION ENDPOINTS (Updated for multiple uploads)
// ---------------------------------------------------------------------

// 📄 Get Hero data
app.get("/api/hero", (req, res) => {
  try {
    if (!fs.existsSync(HERO_FILE)) {
      const defaultHero = {
        texts: [
          "Hi, I'm Chalanka Kodikara",
          "I'm a Software Engineer and Designer",
        ],
        description:
          "I craft scalable, high-performance software systems with a passion for clean design, seamless user experience, and reliable architecture.",
        images: [],
      };
      fs.writeFileSync(HERO_FILE, JSON.stringify(defaultHero, null, 2));
      return res.json(defaultHero);
    }
    const data = JSON.parse(fs.readFileSync(HERO_FILE, "utf-8"));
    res.json(data);
  } catch (err) {
    console.error("Error reading hero:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ✏️ Save hero (texts, description, images)
app.post("/api/hero", (req, res) => {
  try {
    const data = req.body;
    fs.writeFileSync(HERO_FILE, JSON.stringify(data, null, 2));
    res.json({ success: true, message: "Hero data saved successfully" });
  } catch (err) {
    console.error("Error saving hero:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 🖼 Upload single Hero image
app.post("/api/hero/upload", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No image uploaded" });
    }
    const fileUrl = `/uploads/hero/${req.file.filename}`;
    res.json({ success: true, url: fileUrl });
  } catch (err) {
    console.error("Error uploading hero image:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 🖼 Upload multiple Hero images (for slider)
app.post(
  "/api/hero/upload-multiple",
  upload.array("images", 10),
  (req, res) => {
    try {
      if (!req.files || !req.files.length) {
        return res
          .status(400)
          .json({ success: false, message: "No images uploaded" });
      }

      // Generate URLs
      const urls = req.files.map((f) => `/uploads/hero/${f.filename}`);

      // 🔄 Merge new images with existing ones in hero.json
      let existingHero = { texts: [], description: "", images: [] };
      if (fs.existsSync(HERO_FILE)) {
        existingHero = JSON.parse(fs.readFileSync(HERO_FILE, "utf-8"));
      }

      const updatedHero = {
        ...existingHero,
        images: [...(existingHero.images || []), ...urls],
      };

      fs.writeFileSync(HERO_FILE, JSON.stringify(updatedHero, null, 2));

      res.json({
        success: true,
        message: "Multiple images uploaded successfully",
        urls,
      });
    } catch (err) {
      console.error("Error uploading multiple hero images:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  }
);

// 🗑️ Delete a specific hero image by filename
app.delete("/api/hero/image/:filename", (req, res) => {
  try {
    const filename = req.params.filename;
    const imagePath = path.join(UPLOAD_HERO, filename);
    if (!fs.existsSync(imagePath))
      return res
        .status(404)
        .json({ success: false, message: "Image not found" });

    fs.unlinkSync(imagePath);

    // Remove image from hero.json
    if (fs.existsSync(HERO_FILE)) {
      const data = JSON.parse(fs.readFileSync(HERO_FILE, "utf-8"));
      data.images = (data.images || []).filter(
        (img) => !img.endsWith(filename)
      );
      fs.writeFileSync(HERO_FILE, JSON.stringify(data, null, 2));
    }

    res.json({ success: true, message: "Hero image deleted successfully" });
  } catch (err) {
    console.error("Error deleting hero image:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});
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

app.get("/api/projects/:id", (req, res) => {
  try {
    const filePath = path.join(PROJECTS_DIR, `${req.params.id}.json`);
    if (!fs.existsSync(filePath))
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
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
// 🧩 PHOTOS ENDPOINTS
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
app.post("/api/comments", upload.single("image"), async (req, res) => {
  try {
    const raw = req.body.data;
    if (!raw) {
      return res.status(400).json({ success: false, message: "Missing data" });
    }

    const data = JSON.parse(raw);
    const id = data.id || Date.now().toString();
    let outputPath;

    // ---------------------------------
    // 📸 If image uploaded
    // ---------------------------------
    if (req.file) {
      const inputPath = req.file.path;
      const originalName = req.file.originalname.toLowerCase();

      try {
        // 🟣 Convert HEIC → JPEG
        if (originalName.endsWith(".heic") || originalName.endsWith(".heif")) {
          console.log("🟣 Converting HEIC → JPEG...");
          const inputBuffer = fs.readFileSync(inputPath);
          const outputBuffer = await heicConvert({
            buffer: inputBuffer,
            format: "JPEG",
            quality: 0.7,
          });

          const tempPath = inputPath.replace(/\.heic$/i, ".jpg");
          fs.writeFileSync(tempPath, outputBuffer);
          fs.unlinkSync(inputPath); // remove HEIC file

          // set new path for compression
          req.file.path = tempPath;
        }

        // 🧩 Compress & Resize Image — small dimensions (150x150)
        console.log("🟢 Compressing and resizing image...");
        const outputFilename = `compressed-${Date.now()}.jpg`;
        outputPath = path.join(UPLOAD_COMMENTS, outputFilename);

        await sharp(req.file.path)
          .resize({
            width: 150,
            height: 150,
            fit: "cover",
          })
          .jpeg({ quality: 70 })
          .toFile(outputPath);

        // 🧹 Safe cleanup
        await new Promise((resolve) => setTimeout(resolve, 300));
        try {
          fs.unlinkSync(req.file.path);
        } catch (err) {
          if (err.code !== "ENOENT" && err.code !== "EPERM") {
            console.warn("⚠️ Failed to delete temp file:", err.message);
          }
        }

        // ✅ Save relative path for client
        data.localImage = `/uploads/comments/${path.basename(outputPath)}`;
      } catch (err) {
        console.error("❌ Image processing failed:", err);
        return res.status(500).json({
          success: false,
          message: "Image compression failed",
          error: err.message,
        });
      }
    }

    // ---------------------------------
    // 💾 Save Comment JSON
    // ---------------------------------
    const filePath = path.join(COMMENTS_DIR, `${id}.json`);
    fs.writeFileSync(filePath, JSON.stringify({ ...data, id }, null, 2));

    console.log("✅ Comment saved:", id);
    res.json({ success: true, id, image: data.localImage });
  } catch (err) {
    console.error("❌ Error saving comment:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});
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
// ✏️ Update existing project (with or without new image)
app.put("/api/projects/:id", upload.single("image"), (req, res) => {
  try {
    const id = req.params.id;
    const jsonPath = path.join(PROJECTS_DIR, `${id}.json`);

    // Ensure project exists
    if (!fs.existsSync(jsonPath)) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    // Parse existing data
    const existingData = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

    // Parse new incoming data
    const raw = req.body.data;
    if (!raw)
      return res.status(400).json({ success: false, message: "Missing data" });

    const updatedData = JSON.parse(raw);

    // If new image uploaded, replace old one
    if (req.file) {
      // Delete old image if exists
      if (existingData.localImage) {
        const oldImagePath = path.join(
          __dirname,
          existingData.localImage.replace(/^\/+/, "")
        );
        if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
      }
      updatedData.localImage = `/uploads/projects/${req.file.filename}`;
    } else {
      // Keep the previous image if not changed
      updatedData.localImage = existingData.localImage;
    }

    // Merge and save updated project
    const mergedData = { ...existingData, ...updatedData, id };
    fs.writeFileSync(jsonPath, JSON.stringify(mergedData, null, 2));

    res.json({ success: true, id, data: mergedData });
  } catch (err) {
    console.error("Error updating project:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ➕ Add new graphic project with multiple images
app.post(
  "/api/graphics",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "gallery", maxCount: 10 },
  ]),
  (req, res) => {
    try {
      const raw = req.body.data;
      if (!raw)
        return res
          .status(400)
          .json({ success: false, message: "Missing data" });

      const data = JSON.parse(raw);
      const id = data.id || Date.now().toString();

      // Handle main image
      if (req.files["mainImage"] && req.files["mainImage"][0]) {
        data.mainImage = `/uploads/graphics/${req.files["mainImage"][0].filename}`;
      }

      // Handle gallery images
      if (req.files["gallery"] && req.files["gallery"].length > 0) {
        data.gallery = req.files["gallery"].map(
          (f) => `/uploads/graphics/${f.filename}`
        );
      } else {
        data.gallery = [];
      }

      fs.writeFileSync(
        path.join(GRAPHICS_DIR, `${id}.json`),
        JSON.stringify({ ...data, id }, null, 2)
      );

      res.json({
        success: true,
        id,
        mainImage: data.mainImage,
        gallery: data.gallery,
      });
    } catch (err) {
      console.error("Error saving graphics project:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  }
);

// 📖 Get all graphics projects
app.get("/api/graphics", (req, res) => {
  try {
    const files = fs.readdirSync(GRAPHICS_DIR);
    const data = files.map((f) =>
      JSON.parse(fs.readFileSync(path.join(GRAPHICS_DIR, f), "utf-8"))
    );
    res.json(data);
  } catch (err) {
    console.error("Error reading graphics projects:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 📄 Get single graphic project by ID
app.get("/api/graphics/:id", (req, res) => {
  try {
    const filePath = path.join(GRAPHICS_DIR, `${req.params.id}.json`);
    if (!fs.existsSync(filePath))
      return res.status(404).json({ success: false, message: "Not found" });

    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    res.json(data);
  } catch (err) {
    console.error("Error reading graphics project:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ✏️ Update graphic project
app.put(
  "/api/graphics/:id",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "gallery", maxCount: 10 },
  ]),
  (req, res) => {
    try {
      const id = req.params.id;
      const jsonPath = path.join(GRAPHICS_DIR, `${id}.json`);
      if (!fs.existsSync(jsonPath))
        return res.status(404).json({ success: false, message: "Not found" });

      const existingData = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
      const raw = req.body.data;
      const updatedData = raw ? JSON.parse(raw) : {};

      // Replace or keep main image
      if (req.files["mainImage"] && req.files["mainImage"][0]) {
        if (existingData.mainImage) {
          const oldPath = path.join(
            __dirname,
            existingData.mainImage.replace(/^\/+/, "")
          );
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
        updatedData.mainImage = `/uploads/graphics/${req.files["mainImage"][0].filename}`;
      } else {
        updatedData.mainImage = existingData.mainImage;
      }

      // Replace or append gallery images
      if (req.files["gallery"] && req.files["gallery"].length > 0) {
        updatedData.gallery = [
          ...(existingData.gallery || []),
          ...req.files["gallery"].map((f) => `/uploads/graphics/${f.filename}`),
        ];
      } else {
        updatedData.gallery = existingData.gallery || [];
      }

      const merged = { ...existingData, ...updatedData, id };
      fs.writeFileSync(jsonPath, JSON.stringify(merged, null, 2));
      res.json({ success: true, id, data: merged });
    } catch (err) {
      console.error("Error updating graphics project:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  }
);

// 🗑️ Delete graphic project
app.delete("/api/graphics/:id", (req, res) => {
  try {
    const jsonPath = path.join(GRAPHICS_DIR, `${req.params.id}.json`);
    if (!fs.existsSync(jsonPath))
      return res.status(404).json({ success: false, message: "Not found" });

    const data = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

    if (data.mainImage) {
      const imgPath = path.join(__dirname, data.mainImage.replace(/^\/+/, ""));
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    if (Array.isArray(data.gallery)) {
      for (const img of data.gallery) {
        const imgPath = path.join(__dirname, img.replace(/^\/+/, ""));
        if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
      }
    }

    fs.unlinkSync(jsonPath);
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting graphics project:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ---------------------------------------------------------------------
// 🖼️ FIX: Serve uploaded images correctly (even via /api/uploads/...)
// ---------------------------------------------------------------------
app.get(
  ["/uploads/:folder/:filename", "/api/uploads/:folder/:filename"],
  (req, res) => {
    try {
      const { folder, filename } = req.params;
      const imagePath = path.join(__dirname, "uploads", folder, filename);
      if (!fs.existsSync(imagePath)) {
        return res
          .status(404)
          .json({ success: false, message: "Image not found" });
      }
      res.sendFile(imagePath);
    } catch (err) {
      console.error("Error serving image:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  }
);

// ---------------------------------------------------------------------
// 🚀 Start Server
// ---------------------------------------------------------------------
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
