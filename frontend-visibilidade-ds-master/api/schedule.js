import axios from "axios";

const apiUrl = `${process.env.API_URL}/schedule`;

export const getUserSchedule = async (userId) => {
  const response = await axios.get(`${apiUrl}/${userId}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

export const getPost = async (userId, postId) => {
  const response = await axios.get(`${apiUrl}/${userId}/posts/${postId}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

export const createPost = async (userId, post) => {
  const formData = new FormData();

  if (post.imagePath) {
    try {
      const imageResponse = await axios.get(
        decodeURIComponent(post.imagePath),
        { responseType: "blob" }
      );
      const imageBlob = imageResponse.data;

      const filename = decodeURIComponent(post.imagePath.split("/").pop());

      const file = new File([imageBlob], filename, { type: imageBlob.type });

      formData.append("imagePath", file);

      const { imagePath, ...restOfPost } = post;
      post = restOfPost;
    } catch (error) {
      console.error("Erro ao buscar a imagem:", error);
    }
  }

  if (typeof post === "object") {
    Object.keys(post).forEach((key) => {
      formData.append(key, post[key]);
    });
  }

  const response = await axios.post(`${apiUrl}/${userId}/posts`, formData);

  return response.data;
};

export const updatePost = async (userId, postId, post) => {
  const formData = new FormData();

  if (post.imagePath) {
    try {
      const imageResponse = await axios.get(
        decodeURIComponent(post.imagePath),
        { responseType: "blob" }
      );
      const imageBlob = imageResponse.data;

      const filename = decodeURIComponent(post.imagePath.split("/").pop());

      const file = new File([imageBlob], filename, { type: imageBlob.type });

      formData.append("imagePath", file);

      const { imagePath, ...restOfPost } = post;
      post = restOfPost;
    } catch (error) {
      console.error("Erro ao buscar a imagem:", error);
    }
  }

  console.log(post);
  if (typeof post === "object") {
    Object.keys(post).forEach((key) => {
      formData.append(key, post[key]);
    });
  }

  const response = await axios.patch(
    `${apiUrl}/${userId}/posts/${postId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const deletePost = async (userId, postId) => {
  const response = await axios.delete(`${apiUrl}/${userId}/posts/${postId}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data;
};
