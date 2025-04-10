import axios from "axios";

const apiUrl = `${process.env.API_URL}/usergov`;

export const authenticate = async (email, password) => {
  const response = await axios.post(apiUrl, {
    email,
    password,
  });

  return response.data;
};
