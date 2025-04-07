"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getTemplates } from "@/api/template";
import { getUserSchedule } from "@/api/schedule";
import { Pencil } from "lucide-react";

export default function Postagens() {
  const router = useRouter();
  const [scheduledPosts, setScheduledPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("templates");
  const [templates, setTemplates] = useState([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [loadingScheduled, setLoadingScheduled] = useState(true);

  const handleTemplateClick = (templateId) => {
    router.push(`/postagens/template/${templateId}`);
  };

  const fetchTemplates = async () => {
    setLoadingTemplates(true);
    try {
      const templates = await getTemplates();
      setTemplates(templates.data);
    } catch (error) {
      console.error("Erro ao carregar templates:", error);
    } finally {
      setLoadingTemplates(false);
    }
  };

  const fetchScheduledPosts = async () => {
    setLoadingScheduled(true);
    try {
      const userId = localStorage.getItem('user_id');
      const scheduledPosts = await getUserSchedule(userId);

      if (scheduledPosts.data.posts) {
        setScheduledPosts(scheduledPosts.data.posts);
      } else {
        setScheduledPosts([]);
      }
    } catch (error) {
      setScheduledPosts([]);
    } finally {
      setLoadingScheduled(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
    fetchScheduledPosts();
  }, []);

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          className={`py-2 px-4 font-medium text-lg cursor-pointer ${
            activeTab === "templates"
              ? "border-b-2 border-black text-black-900 dark:border-white dark:text-white"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          }`}
          onClick={() => setActiveTab("templates")}
        >
          Templates
        </button>
        <button
          className={`py-2 px-4 font-medium text-lg cursor-pointer ${
            activeTab === "scheduled"
              ? "border-b-2 border-black text-black-900 dark:border-white dark:text-white"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          }`}
          onClick={() => setActiveTab("scheduled")}
        >
          Posts Agendados
        </button>
      </div>

      {activeTab === "templates" && (
        <div className="space-y-4">
          <div className="mt-4">
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Templates</h2>
                <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700 ml-4"></div>
              </div>

              {loadingTemplates ? (
                <div className="flex justify-center items-center h-32 mt-4">
                  <p className="text-gray-500 dark:text-gray-400">Carregando...</p>
                </div>
              ) : templates.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                  {templates.map((template, index) => (
                    <div 
                      key={index}
                      className="cursor-pointer group"
                      onClick={() => handleTemplateClick(template._id)}
                    >
                      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden h-32 relative">
                        <img
                          src={template.imageUrl}
                          alt={template.alt}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                            Usar template
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex justify-center items-center h-32 mt-4">
                  <p className="text-gray-500 dark:text-gray-400">Nenhum template encontrado</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "scheduled" && (
        <div className="space-y-4">
          <div className="mt-4">
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Posts agendados</h2>
                <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700 ml-4"></div>
              </div>

              {loadingScheduled ? (
                <div className="flex justify-center items-center h-32 mt-4">
                  <p className="text-gray-500 dark:text-gray-400">Carregando...</p>
                </div>
              ) : scheduledPosts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                  {scheduledPosts.map((post, index) => (
                    <div key={index} className="relative">
                      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden h-32 relative">
                        <img
                          src={post.imageUrl}
                          alt={post.postTitle}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        className="mt-2 w-full flex items-center justify-center gap-2 bg-white-600 hover:bg-gray-300 border border-gray-300 text-black p-2 rounded-md cursor-pointer dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-700 dark:text-white"
                        onClick={() => router.push(`/postagens/editar/${post._id}`)}
                      >
                        <Pencil size={12} />
                        Editar
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex justify-center items-center h-32 mt-4">
                  <p className="text-gray-500 dark:text-gray-400">Nenhum post agendado</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}