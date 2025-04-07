"use client";

import { Edit, Trash } from "lucide-react";
import { useState, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getUserSchedule } from "@/api/schedule";

export default function Dashboard() {
  const router = useRouter();
  const [recentWorks, setRecentWorks] = useState([]);

  const handleEditPost = (id) => {
    router.push(`/postagens/editar/${id}`);
  };

  const handleDeletePost = (id) => {
    console.log(id);
  };

  const fetchRecentWorks = async () => {
    const userId = localStorage.getItem('user_id');
    const response = await getUserSchedule(userId, 1);
    setRecentWorks(response.data.posts);
  }

  useEffect(() => {
    fetchRecentWorks();
  }, []);

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="space-y-4">
      <div className="mt-4">
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Próximas postagens</h2>
                <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700 ml-4"></div>
              </div>

              <div className="overflow-x-auto mt-4">
                <table className="w-full border-collapse bg-white dark:bg-gray-800 text-left text-sm text-gray-500 dark:text-gray-400 rounded-xl overflow-hidden">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th scope="col" className="px-6 py-4 font-medium text-gray-900 dark:text-gray-200">
                        Postagem
                      </th>
                      <th scope="col" className="px-6 py-4 font-medium text-gray-900 dark:text-gray-200">
                        Data
                      </th>
                      <th scope="col" className="px-6 py-4 font-medium text-gray-900 dark:text-gray-200">
                        Hora
                      </th>
                      <th scope="col" className="px-6 py-4 font-medium text-gray-900 dark:text-gray-200">
                        Redes sociais
                      </th>
                      <th scope="col" className="px-6 py-4 font-medium text-gray-900 dark:text-gray-200"></th>
                      <th scope="col" className="px-6 py-4 font-medium text-gray-900 dark:text-gray-200"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700 border-t border-gray-100 dark:border-gray-700">
                    {recentWorks.map((post) => (
                      <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{post.postTitle}</td>
                        <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{new Date(post.postDate).toLocaleDateString('pt-BR')}</td>
                        <td className="px-6 py-4">{post.postTime}</td>
                        <td className="px-6 py-4">{post.platform}</td>
                        <td className="px-6 py-4">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs flex items-center cursor-pointer"
                            onClick={() => handleEditPost(post._id)}
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Editar
                          </Button>
                        </td>
                        <td className="px-6 py-4">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs flex items-center cursor-pointer text-red-500"
                            onClick={() => handleDeletePost(post._id)}
                          >
                            <Trash className="h-3 w-3 mr-1" />
                            Excluir
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}