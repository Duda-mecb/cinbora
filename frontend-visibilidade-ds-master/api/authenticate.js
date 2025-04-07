import axios from "axios";

const apiUrl = `http://localhost:3011/usergov`;

export const authenticate = async (email, password) => {
  const response = await axios.post(apiUrl, {
    email,
    password,
  });

  return response.data;
};
