import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { editImage } from "../controllers/imageEditorController.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configuração do multer
const upload = multer({
  dest: path.join(__dirname, "..", "uploads", "temp")
});

// Rota para edição de imagem
router.post("/edit-image", upload.single("image"), editImage);

export default router;
