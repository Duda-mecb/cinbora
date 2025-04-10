import axios from "axios";

const apiUrl = `${process.env.API_URL}/template`;

export const getTemplates = async () => {
  try {
    console.log(apiUrl);
    const response = await axios.get(apiUrl);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar templates:", error);
    throw error;
  }
};
export const getTemplateById = async (id) => {
  const response = await axios.get(`${apiUrl}/${id}`);
  return response.data;
};

export const createTemplate = async (template) => {
  const response = await axios.post(apiUrl, template, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

export const updateTemplate = async (id, template) => {
  const response = await axios.put(`${apiUrl}/${id}`, template, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const deleteTemplate = async (id) => {
  const response = await axios.delete(`${apiUrl}/${id}`);
  return response.data;
};
