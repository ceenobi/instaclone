import { rateLimit } from "express-rate-limit";

export const rateLimiter = rateLimit({
    windowMs: 2 * 60 * 1000, //2 minutes
    max: 10, //10 attempts within a 2 min window
    message: "Too many requests attempts, please try again later",
  });
