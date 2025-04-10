"use client";

import { use, useEffect, useState, useRef } from "react";
import { getPost, updatePost } from "@/api/schedule";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Clock, CalendarIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation";

export default function EditPost({ params }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const [post, setPost] = useState(null);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isTimeOpen, setIsTimeOpen] = useState(false);
  const [selectedSocialMedia, setSelectedSocialMedia] = useState("");
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const hours = i.toString().padStart(2, '0')
    const minutes = '00'
    return `${hours}:${minutes}`
  });

 // Canvas Editor
const canvasRef = useRef(null);
const [canvasText, setCanvasText] = useState("");

useEffect(() => {
  const canvas = canvasRef.current;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}, []);

const desenharTexto = () => {
  const canvas = canvasRef.current;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#000";
  ctx.font = "24px Arial";
  ctx.fillText(canvasText, 50, 50);
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

  const handleTimeSelect = (selectedTime) => {
    setTime(selectedTime)
    setIsTimeOpen(false)
  }

  const handleDateSelect = (selectedDate) => {
    setDate(selectedDate)
    setIsDateOpen(false)
  }

  const handleUpdatePost = async () => {
    const userId = localStorage.getItem('user_id');
    const postPayloadToUpdate = {
      postTitle: title,
      postText: caption,
      postDate: date,
      postTime: time,
      platform: selectedSocialMedia,
      imagePath: post.imageUrl,
    }

    await updatePost(userId, unwrappedParams.id, postPayloadToUpdate);
    router.push("/postagens");
  }

  const getPostById = async () => {
    const userId = localStorage.getItem('user_id');
    const response = await getPost(userId, unwrappedParams.id);
    console.log(response.data);
    setPost(response.data);

    setDate(new Date(response.data.postDate));
    setTime(response.data.postTime);
    console.log(response.data.platform);
    setSelectedSocialMedia(response.data.platform);
    setTitle(response.data.postTitle);
    setCaption(response.data.postText);
  }

  useEffect(() => {
    getPostById();
  }, []);

  return (
    <div className="flex flex-1">
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => router.push("/postagens")} className="mr-2 cursor-pointer">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold">Editar Postagem</h1>
          </div>
        </div>

        <div className="flex flex-1 gap-8">
          <div className="w-1/2 flex flex-col gap-4">
            {post && (
              <div className="bg-gray-200 dark:bg-gray-700 rounded-lg aspect-square flex items-center justify-center relative group">
                <img src={post.imageUrl} alt={post.postTitle} className="w-full h-full object-cover" />
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
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título da postagem</Label>
                <Input
                  id="title"
                  placeholder="Digite o título da postagem"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Legenda da postagem</Label>
                <textarea
                id="description"
                placeholder="Legenda..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="min-h-[150px] resize w-full border-[1px] border-gray-300 rounded-md p-2 outline-none"
              />
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="date">
                  Data de publicação <span className="text-red-500">*</span>
                </Label>
                <Popover open={isDateOpen} onOpenChange={setIsDateOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "dd/MM/yyyy") : "Selecione uma data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={handleDateSelect}
                      initialFocus
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">
                  Horário <span className="text-red-500">*</span>
                </Label>
                <Popover open={isTimeOpen} onOpenChange={setIsTimeOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !time && "text-muted-foreground"
                      )}
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      {time ? time : "Selecione um horário"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-0" align="start">
                    <div className="max-h-[300px] overflow-y-auto p-1">
                      {timeOptions.map((t) => (
                        <Button
                          key={t}
                          variant="ghost"
                          className={cn(
                            "w-full justify-start font-normal cursor-pointer",
                            time === t && "bg-accent text-accent-foreground",
                          )}
                          onClick={() => handleTimeSelect(t)}
                        >
                          {t}
                        </Button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="socialMedia">Redes Sociais</Label>
                <Select onValueChange={setSelectedSocialMedia} value={selectedSocialMedia}>
                  <SelectTrigger className="w-full cursor-pointer">
                    <SelectValue placeholder="Selecione a rede social..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem className="cursor-pointer" value="Facebook">Facebook</SelectItem>
                      <SelectItem className="cursor-pointer" value="Instagram">Instagram</SelectItem>
                      <SelectItem className="cursor-pointer" value="Twitter">Twitter</SelectItem>
                      <SelectItem className="cursor-pointer" value="LinkedIn">LinkedIn</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full cursor-pointer" onClick={handleUpdatePost}>
                Atualizar Postagem
              </Button>

                            {/* Editor de Imagem com Texto */}
              <div className="mt-10">
                <h3 className="text-lg font-semibold mb-2">Editor de imagem</h3>
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={400}
                  className="border border-gray-400 mb-4 rounded"
                />
                <div className="flex gap-2">
                  <Input
                    value={canvasText}
                    onChange={(e) => setCanvasText(e.target.value)}
                    placeholder="Digite um texto para desenhar na imagem"
                  />
                  <Button onClick={desenharTexto}>Adicionar texto</Button>
                </div>
              </div>
                                  
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}