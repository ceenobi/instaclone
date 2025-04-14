import express from "express";
import { createPost } from "../controller/post.js";
import { verifyToken, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

router.post(
  "/create",
  verifyToken,
  authorizeRoles("user", "admin"),
  createPost
);

export default router;
