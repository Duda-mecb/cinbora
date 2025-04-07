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
  const [isGenerating, setIsGenerating] = useState(false);
  const [template, setTemplate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
    const response = await fetch(template.imageUrl);
    const blob = await response.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${template.name}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
                <Input id="font-size" type="number" defaultValue={16} min={8} max={72} className="w-full" />
              </div>
            </div>

            {template && (
              <div className="bg-gray-200 dark:bg-gray-700 rounded-lg aspect-square flex items-center justify-center relative group">
                <img src={template.imageUrl} alt={template.name} className="w-full h-full object-cover" />
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
              <ChromePicker color={color} onChange={(newColor) => setColor(newColor.hex)} disableAlpha={false} />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-2">Gere um texto criativo para o template</label>
              <Input id="description" placeholder="Descreva brevemente seu template" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="flex justify-center">
              <Button onClick={generateCaption} className="w-full cursor-pointer" disabled={isGenerating}>
                {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Gerar texto criativo
              </Button>
            </div>
            <div>
              <label htmlFor="caption" className="block text-sm font-medium mb-2">Texto gerado</label>
              <Textarea id="caption" placeholder="Texto..." value={caption} onChange={(e) => setCaption(e.target.value)} className="min-h-[150px]" />
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
