import rateLimit from "express-rate-limit";

const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: "You can only make 5 requests every 15 minutes",
  standardHeaders: true,
  legacyHeaders: false,
});

export default authRateLimiter;
