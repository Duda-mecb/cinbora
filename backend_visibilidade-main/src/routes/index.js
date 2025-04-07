// src/routes/index.js
import { Router } from "express";
import imageEditorRoutes from "./imageEditor.routes.js";

const router = Router();

// Rotas do editor de imagem
router.use("/editor", imageEditorRoutes);

// Adicione aqui outras rotas do projeto futuramente

export default router;
