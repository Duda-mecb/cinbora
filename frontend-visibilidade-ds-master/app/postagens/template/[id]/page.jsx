"use client";

import { Download, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ChromePicker } from "react-color";
import { generateText } from "@/api/gemini";
import { getTemplateById } from "@/api/template";
import { use } from "react";

export default function TemplateEditPage({ params }) {
  const router = useRouter();
  const [description, setDescription] = useState("");
  const [caption, setCaption] = useState("");
  const [color, setColor] = useState("#ffffff");
  const [fontSize, setFontSize] = useState(24);
  const [isGenerating, setIsGenerating] = useState(false);
  const [template, setTemplate] = useState(null);
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [textPosition, setTextPosition] = useState({ x: 40, y: 40 });
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const unwrappedParams = use(params);

  const generateCaption = async () => {
    setIsGenerating(true);
    try {
      const generatedCaption = await generateText(description);
      setCaption(generatedCaption.text.replace(/<[^>]>?/g, '').replace(/\*/g, ''));
    } catch (error) {
      console.error("Erro ao gerar texto:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const fetchTemplate = async () => {
    const template = await getTemplateById(unwrappedParams.id);
    setTemplate(template.data);
    setIsLoading(false);
  };

  const handleDownload = async () => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = template.imageUrl;
  
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
  
      const imageElement = document.querySelector("img[src='" + template.imageUrl + "']");
      if (!imageElement) return;
  
      const displayWidth = imageElement.clientWidth;
      const displayHeight = imageElement.clientHeight;
  
      canvas.width = image.width;
      canvas.height = image.height;
  
      // Cálculo do scale em relação ao DOM
      const scaleX = image.width / displayWidth;
      const scaleY = image.height / displayHeight;
  
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  
      const scaledFontSize = fontSize * scaleY;
      ctx.font = `${scaledFontSize}px sans-serif`;
      ctx.fillStyle = color;
      ctx.textBaseline = "top";
      ctx.shadowColor = "black";
      ctx.shadowOffsetX = 1 * scaleX;
      ctx.shadowOffsetY = 1 * scaleY;
      ctx.shadowBlur = 3 * scaleX;
  
      const ajusteHorizontal = 2 * scaleX;  
      const ajusteVertical = 5 * scaleY;    
      const x = (textPosition.x + ajusteHorizontal) * scaleX;
      const y = (textPosition.y + ajusteVertical) * scaleY;
  
      const lines = text.split("\n");
      lines.forEach((line, index) => {
        ctx.fillText(line, x, y + index * (scaledFontSize + 5 * scaleY));
      });
  
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `${template.name}_editado.png`;
      link.click();
    };
  };
  

  const handleMouseDown = (e) => {
    setIsDragging(true);
    const rect = e.target.getBoundingClientRect();
    setOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const container = e.currentTarget.closest(".image-container");
    if (!container) return;

    const containerRect = container.getBoundingClientRect();

    setTextPosition({
      x: e.clientX - containerRect.left - offset.x,
      y: e.clientY - containerRect.top - offset.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    fetchTemplate();
  }, []);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        Carregando...
      </div>
    );
  }

  return (
    <div className="flex flex-1">
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => router.push("/postagens")} className="mr-2 cursor-pointer">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold">Editar Template</h1>
          </div>
        </div>

        <div className="flex flex-1 gap-8">
          <div className="w-1/2 flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-2">
              <Button className="bg-white text-gray-900 hover:bg-gray-100 shadow-md cursor-pointer p-2 dark:text-white" size="xs" variant="outline">
                Adicionar Texto
              </Button>
              <div className="flex items-center gap-2 flex-1">
                <label htmlFor="font-size" className="text-sm whitespace-nowrap">Tamanho da fonte:</label>
                <Input
                  id="font-size"
                  type="number"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  min={8}
                  max={72}
                  className="w-full"
                />
              </div>
            </div>

            {template && (
              <div
                className="bg-gray-200 dark:bg-gray-700 rounded-lg aspect-square flex items-center justify-center relative group image-container"
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <img src={template.imageUrl} alt={template.name} className="w-full h-full object-cover" />
                {text && (
                  <div
                    style={{
                      position: "absolute",
                      top: textPosition.y,
                      left: textPosition.x,
                      fontSize: fontSize + "px",
                      color,
                      textShadow: "1px 1px 3px black",
                      padding: "5px",
                      zIndex: 10,
                      maxWidth: "90%",
                      wordWrap: "break-word",
                      whiteSpace: "pre-line",
                      cursor: "move",
                    }}
                    onMouseDown={handleMouseDown}
                  >
                    {text}
                  </div>
                )}
              </div>
            )}

            <div className="mt-2">
              <Button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300 cursor-pointer" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Salvar no dispositivo
              </Button>
            </div>
          </div>

          <div className="w-1/2 space-y-6">
            <div className="w-full">
              <label className="block text-lg font-medium mb-2">Selecione uma cor</label>
              <ChromePicker color={color} onChange={(newColor) => setColor(newColor.hex)} disableAlpha={true} />
            </div>

            <div>
              <label htmlFor="text" className="block text-sm font-medium mb-2">Texto sobre a imagem</label>
              <Textarea
                id="text"
                placeholder="Digite o texto para aparecer sobre a imagem"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full min-h-[100px]"
              />
            </div>

            <div className="pt-4 flex gap-4 w-full">
              <Button className="flex-1 bg-gray-900 hover:bg-gray-800 text-white cursor-pointer" onClick={() => router.push(`/agendamento/${template._id}?imagePath=${encodeURIComponent(template.imageUrl)}`)}>
                Continuar para agendamento
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}