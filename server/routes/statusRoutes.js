import express from "express";
import {
  createStatus,
  getStatuses,
  getCategories,
  updateStatus,
  deleteStatus,
  addCategory,
  deleteCategory,
} from "../controllers/statusController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * STATUS ROUTES
 */

// Get all statuses (public), Create new status (protected)
router.route("/").get(getStatuses).post(protect, createStatus);

// Update/Delete status by ID (protected)
router.route("/:id").put(protect, updateStatus).delete(protect, deleteStatus);

/**
 * CATEGORY ROUTES
 */

// Get all unique categories
router.get("/categories", getCategories);

// Add new category (protected)
router.post("/categories", protect, addCategory);

// Delete category by name (protected)
router.delete("/categories/:name", protect, deleteCategory);

export default router;
