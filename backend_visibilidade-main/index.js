import express from "express";
import cors from "cors";
import logger from "morgan";
import { config } from "dotenv";
import bodyParser from "body-parser";
import routes from "./src/routes/index.js";
import imageEditorRoutes from "./src/routes/imageEditor.routes.js"; // <-- IMPORTADO AQUI

config();

const app = express();
const PORT = process.env.PORT || 3011;

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/api", routes); 

app.use(routes);

// 🔧 Integração do editor de imagem
app.use("/editor", imageEditorRoutes);

// Servir as imagens editadas (caso queira que fiquem acessíveis via navegador)
app.use("/outputs", express.static("outputs"));

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
