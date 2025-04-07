import axios from "axios";
const apiUrl = `${process.env.API_URL}/generate-text`;

export const generateText = async (prompt) => {
  const response = await axios.post(apiUrl, { prompt }, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data;
};
