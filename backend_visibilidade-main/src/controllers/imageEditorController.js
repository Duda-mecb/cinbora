import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Garante compatibilidade com ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Função para quebrar o texto em múltiplas linhas
const wrapText = (text, maxWidth, fontSize) => {
  const words = text.split(" ");
  let lines = [];
  let currentLine = "";

  for (let word of words) {
    let testLine = currentLine ? `${currentLine} ${word}` : word;
    let testWidth = testLine.length * (fontSize / 2); // Estimativa aproximada

    if (testWidth > maxWidth) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }

  lines.push(currentLine);
  return lines;
};

export const editImage = async (req, res) => {
  const {
    text,
    color = "white",
    font = "Arial",
    fontSize = 40,
    xPosition = 50,
    yPosition = 50,
  } = req.body;

  const imagePath = req.file?.path;

  if (!imagePath) {
    return res.status(400).json({ error: "Imagem não enviada corretamente." });
  }

  const userTemplatesDir = path.join(__dirname, "..", "uploads", "userTemplates");

  if (!fs.existsSync(userTemplatesDir)) {
    fs.mkdirSync(userTemplatesDir, { recursive: true });
  }

  const outputImage = path.join(userTemplatesDir, `${Date.now()}_edited.png`);

  const xPos = parseInt(xPosition, 10);
  const yPos = parseInt(yPosition, 10);
  const fontSz = parseInt(fontSize, 10);

  try {
    const imageMetadata = await sharp(imagePath).metadata();
    const imageWidth = imageMetadata.width;
    const imageHeight = imageMetadata.height;

    const lines = wrapText(text, imageWidth - xPos * 2, fontSz);
    const lineHeight = fontSz * 1.2;
    const requiredHeight = lines.length * lineHeight + yPos;

    let svgText = `<svg width="${imageWidth}" height="${Math.max(requiredHeight, imageHeight)}">`;
    let currentY = yPos;

    for (let line of lines) {
      svgText += `<text x="${xPos}" y="${currentY}" font-size="${fontSz}" fill="${color}" font-family="${font}">${line}</text>`;
      currentY += lineHeight;
    }

    svgText += `</svg>`;

    await sharp(imagePath)
      .extend({
        top: 0,
        bottom: requiredHeight > imageHeight ? requiredHeight - imageHeight : 0,
        left: 0,
        right: 0,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .composite([
        {
          input: Buffer.from(svgText),
          top: 0,
          left: 0,
        },
      ])
      .toFile(outputImage);

    res.json({
      imageUrl: `/userTemplates/${path.basename(outputImage)}`,
    });
  } catch (error) {
    console.error("Erro ao editar imagem:", error);
    res.status(500).json({ error: "Erro ao editar imagem" });
  }
};
