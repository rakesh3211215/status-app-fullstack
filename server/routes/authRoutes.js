import express from "express";
import {
  registerUser,
  authUser,
  getUserProfile,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", authUser);
router.get("/me", protect, getUserProfile);

export default router;
