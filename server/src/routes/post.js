import express from "express";
import {
  createPost,
  getAllPosts,
  handleLikePost,
  seeWhoLikedPost,
  handleSavePost,
  getAPost,
  deletePost,
  updatePost,
  explorePosts,
  getPostsByTags,
} from "../controller/post.js";
import { verifyToken, authorizeRoles } from "../middleware/auth.js";
import { cacheMiddleware, clearCache } from "../middleware/cache.js";

const router = express.Router();

router.post(
  "/create",
  verifyToken,
  authorizeRoles("user", "admin"),
  (req, res, next) => {
    clearCache("posts");
    next();
  },
  createPost
);

router.get(
  "/get",
  verifyToken,
  authorizeRoles("user", "admin"),
  cacheMiddleware("posts", 600),
  getAllPosts
);

router.patch(
  "/like/:id",
  verifyToken,
  authorizeRoles("user", "admin"),
  (req, res, next) => {
    clearCache("posts");
    clearCache("post");
    clearCache("profile");
    next();
  },
  handleLikePost
);

router.patch(
  "/save/:id",
  verifyToken,
  authorizeRoles("user", "admin"),
  (req, res, next) => {
    clearCache("posts");
    clearCache("post");
    clearCache("profile");
    next();
  },
  handleSavePost
);

router.get(
  "/see-who-liked/:id",
  verifyToken,
  authorizeRoles("user", "admin"),
  cacheMiddleware("seeLikes", 600),
  seeWhoLikedPost
);
router.get(
  "/get/:id",
  verifyToken,
  authorizeRoles("user", "admin"),
  cacheMiddleware("post", 600),
  getAPost
);

router.delete(
  "/delete/:id",
  verifyToken,
  authorizeRoles("user", "admin"),
  (req, res, next) => {
    clearCache("posts"); //clear previous posts
    next();
  },
  deletePost
);

router.patch(
  "/update/:id",
  verifyToken,
  authorizeRoles("user", "admin"),
  (req, res, next) => {
    clearCache("post"); //clear previous post
    next();
  },
  updatePost
);

router.get(
  "/explore",
  verifyToken,
  authorizeRoles("user", "admin"),
  cacheMiddleware("explore", 60),
  explorePosts
);

router.get(
  "/get-posts-tags/:tags",
  verifyToken,
  authorizeRoles("user", "admin"),
  cacheMiddleware("explore", 600),
  getPostsByTags
);

export default router;
