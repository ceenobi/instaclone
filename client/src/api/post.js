import axiosInstance from "../utils/axiosInstance";

export const createPost = async (formData) => {
  return await axiosInstance.post("/api/post/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}; 