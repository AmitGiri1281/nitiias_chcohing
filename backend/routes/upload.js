// ================= routes/upload.js =================
// C:\Users\Lenovo\OneDrive\Desktop\NITIIAS choching\backend\routes\upload.js
const express = require("express");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const { protect, admin } = require("../middleware/auth"); // Your auth middleware
const upload = require("../middleware/upload"); // Your existing upload middleware

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ================= SINGLE IMAGE UPLOAD =================
// Protected route - only authenticated users can upload
router.post(
  "/image",
  protect,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }

      // ✅ ADD THIS BLOCK HERE
      if (req.file.size > 5 * 1024 * 1024) {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({
          success: false,
          message: "Image too large. Max 5MB allowed",
        });
      }

      // Check if it's an image (not PDF)
      const isImage = req.file.mimetype.startsWith("image/");
      if (!isImage) {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({
          success: false,
          message: "Only image files are allowed for blog content",
        });
      }

      // Generate URL for the uploaded image
      const baseUrl = `${req.protocol}://${req.get("host")}`;
      const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;

      // Optional: Emit socket event for real-time updates
      const io = req.app.get("io");
      if (io) {
        io.emit("imageUploaded", {
          userId: req.user._id,
          userName: req.user.name,
          imageUrl,
          filename: req.file.filename,
        });
      }

      res.status(200).json({
        success: true,
        message: "Image uploaded successfully",
        url: imageUrl,
        filename: req.file.filename,
        size: req.file.size,
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({
        success: false,
        message: "Image upload failed",
        error: error.message,
      });
    }
  }
);

// ================= MULTIPLE IMAGES UPLOAD =================
// Protected route - only authenticated users can upload
router.post(
  "/images",
  protect, // Your auth middleware
  upload.array("images", 10), // Max 10 images
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No files uploaded",
        });
      }

      // Filter out non-image files
      const imageFiles = req.files.filter(file => file.mimetype.startsWith('image/'));
      const nonImageFiles = req.files.filter(file => !file.mimetype.startsWith('image/'));

      // Delete non-image files
      nonImageFiles.forEach(file => {
        fs.unlinkSync(file.path);
      });

      if (imageFiles.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No valid image files uploaded",
        });
      }

      const baseUrl = `${req.protocol}://${req.get("host")}`;
      const imageUrls = imageFiles.map((file) => ({
        url: `${baseUrl}/uploads/${file.filename}`,
        filename: file.filename,
        size: file.size,
        mimetype: file.mimetype,
      }));

      res.status(200).json({
        success: true,
        message: `${imageFiles.length} images uploaded successfully`,
        skipped: nonImageFiles.length,
        images: imageUrls,
      });
    } catch (error) {
      console.error("Multiple upload error:", error);
      res.status(500).json({
        success: false,
        message: "Images upload failed",
        error: error.message,
      });
    }
  }
);

// ================= DELETE IMAGE =================
// Protected route - only authenticated users can delete
router.delete("/image/:filename", protect, async (req, res) => {
  try {
    const filename = req.params.filename;
    const filepath = path.join(uploadDir, filename);

    // Check if file exists
    if (!fs.existsSync(filepath)) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    // Optional: Check if user owns this file (if filename contains userId)
    // You can enhance this based on your filename pattern
    if (!filename.includes(req.user._id.toString()) && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to delete this image",
      });
    }

    // Delete file
    fs.unlinkSync(filepath);

    res.status(200).json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({
      success: false,
      message: "Image deletion failed",
      error: error.message,
    });
  }
});

// ================= ADMIN ONLY: GET ALL IMAGES =================
router.get("/images", protect, admin, async (req, res) => {
  try {
    const files = fs.readdirSync(uploadDir);
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    
    const images = files
      .filter(file => /\.(jpeg|jpg|png|gif|webp)$/i.test(file))
      .map(file => {
        const stats = fs.statSync(path.join(uploadDir, file));
        return {
          filename: file,
          url: `${baseUrl}/uploads/${file}`,
          size: stats.size,
          uploadedAt: stats.birthtime,
        };
      })
      .sort((a, b) => b.uploadedAt - a.uploadedAt); // Newest first

    res.status(200).json({
      success: true,
      count: images.length,
      images,
    });
  } catch (error) {
    console.error("Get images error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch images",
      error: error.message,
    });
  }
});

module.exports = router;