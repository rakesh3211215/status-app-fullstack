import express from "express";
import {
  getCategories,
  createCategory,
  deleteCategory,
  updateCategory,
  bulkCreateCategories,
} from "../controllers/categoryController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(getCategories).post(protect, admin, createCategory);

router
  .route("/:id")
  .delete(protect, admin, deleteCategory)
  .put(protect, admin, updateCategory);

router.post("/bulk", protect, admin, bulkCreateCategories);

export default router;
