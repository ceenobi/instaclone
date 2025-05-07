import express from "express";
import {
  createComment,
  getComments,
  deleteComment,
  likeComment,
} from "../controller/comment.js";
import { verifyToken, authorizeRoles } from "../middleware/auth.js";
import { cacheMiddleware, clearCache } from "../middleware/cache.js";

const router = express.Router();

router.post(
  "/create/:postId",
  verifyToken,
  authorizeRoles("user", "admin"),
  (req, res, next) => {
    clearCache("post_Comments"); //clear previous comments
    clearCache("post"); //clear previous comments
    next();
  },
  createComment
);
router.get(
  "/get/:id",
  verifyToken,
  authorizeRoles("user", "admin"),
  cacheMiddleware("post_Comments", 600),
  getComments
);

router.delete(
  "/delete/:id",
  verifyToken,
  authorizeRoles("user", "admin"),
  (req, res, next) => {
    clearCache("post_Comments"); //clear previous comments
    next();
  },
  deleteComment
);

router.patch(
  "/like/:id",
  verifyToken,
  authorizeRoles("user", "admin"),
  (req, res, next) => {
    clearCache("post_Comments");
    clearCache("post");
    next();
  },
  likeComment
);

export default router;
