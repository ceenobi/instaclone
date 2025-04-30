import { createContext, useContext } from "react";

export const AuthContext = createContext({});
export const PostContext = createContext({});

export const useAuth = () => {
  const authStore = useContext(AuthContext);
  if (authStore === undefined) {
    throw new Error("useAuth must be defined within an AuthProvider");
  }
  return authStore;
};

export const usePosts = () => {
  const postStore = useContext(PostContext);
  if (postStore === undefined) {
    throw new Error("usePosts must be defined within an PostProvider");
  }
  return postStore;
};
