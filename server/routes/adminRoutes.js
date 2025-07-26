import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import {
  getAllUsers,
  updateUserRole,
  getAllStatuses,
} from "../controllers/adminController.js";

const router = express.Router();

router.route("/users").get(protect, admin, getAllUsers);

router.route("/users/:id/role").put(protect, admin, updateUserRole);

router.route("/statuses").get(protect, admin, getAllStatuses);

export default router;
