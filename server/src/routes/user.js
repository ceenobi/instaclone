import express from "express";
import {
  registerUser,
  loginUser,
  authenticateUser,
  resendEmailVerificationLink,
  verifyEmailAccount,
  sendForgotPasswordMail,
  resetPassword,
  logout,
  followUser,
  getAUser,
  changeProfilePicture,
  updateUserProfile,
  getRandomUsers,
  getUserFollowers,
  getUserFollowing,
  updatePassword,
  updateUserPrivacy,
  deleteAccount,
  searchUsers,
} from "../controller/user.js";
import { verifyToken, authorizeRoles } from "../middleware/auth.js";
import { rateLimiter } from "../middleware/rateLimiter.js";
import { cacheMiddleware, clearCache } from "../middleware/cache.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", rateLimiter, loginUser);
router.post(
  "/resend-verification-email",
  rateLimiter,
  verifyToken,
  authorizeRoles("user", "admin"),
  resendEmailVerificationLink
);
router.post("/sendforgot-password-mail", sendForgotPasswordMail);
router.post(
  "/logout",
  (req, res, next) => {
    clearCache(null, true);
    next();
  },
  logout
);

//get
router.get(
  "/user",
  verifyToken,
  authorizeRoles("user", "admin"),
  cacheMiddleware("auth_User", 600),
  authenticateUser
);

router.patch(
  "/verify-account/:userId/:verificationToken",
  verifyToken,
  authorizeRoles("user", "admin"),
  (req, res, next) => {
    clearCache("auth_User"); //clear user info
    next();
  },
  verifyEmailAccount
);
router.patch("/reset-password/:userId/:passwordToken", resetPassword);

router.patch(
  "/follow/:id",
  verifyToken,
  authorizeRoles("user", "admin"),
  (req, res, next) => {
    clearCache("auth_User");
    clearCache("profile"); //new
    clearCache("followers"); //new
    clearCache("following"); //new
    next();
  },
  followUser
);

router.get(
  "/profile/:username",
  verifyToken,
  authorizeRoles("user", "admin"),
  cacheMiddleware("profile", 600),
  getAUser
);

router.patch(
  "/updateProfilePicture",
  verifyToken,
  authorizeRoles("user", "admin"),
  (req, res, next) => {
    clearCache("profile");
    clearCache("posts");
    clearCache("auth_User"); //new
    next();
  },
  changeProfilePicture
);

router.patch(
  "/update-profile",
  verifyToken,
  authorizeRoles("user", "admin"),
  (req, res, next) => {
    clearCache("profile");
    clearCache("auth_User");
    next();
  },
  updateUserProfile
);

router.get(
  "/get-random-users",
  verifyToken,
  authorizeRoles("user", "admin"),
  cacheMiddleware("randomUsers", 600),
  getRandomUsers
);

router.get(
  "/followers/:username",
  verifyToken,
  authorizeRoles("user", "admin"),
  cacheMiddleware("followers", 600),
  getUserFollowers
);

router.get(
  "/following/:username",
  verifyToken,
  authorizeRoles("user", "admin"),
  cacheMiddleware("following", 600),
  getUserFollowing
);

router.patch(
  "/update-password",
  verifyToken,
  authorizeRoles("user", "admin"),
  updatePassword
);

router.patch(
  "/update-privacy",
  verifyToken,
  authorizeRoles("user", "admin"),
  (req, res, next) => {
    clearCache("auth_User");
    next();
  },
  updateUserPrivacy
);

router.delete(
  "/delete-account",
  verifyToken,
  authorizeRoles("user", "admin"),
  deleteAccount
);

router.get(
  "/search",
  verifyToken,
  authorizeRoles("user", "admin"),
  searchUsers
);

export default router;
