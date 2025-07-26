import asyncHandler from "express-async-handler";
import Category from "../models/Category.js";
import Status from "../models/Status.js";

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({}).sort({ createdAt: -1 });
  res.json(categories);
});

// @desc    Create a new category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name) {
    res.status(400);
    throw new Error("Category name is required");
  }

  const categoryExists = await Category.findOne({ name });
  if (categoryExists) {
    res.status(400);
    throw new Error("Category already exists");
  }

  const category = await Category.create({ name });
  res.status(201).json(category);
});

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  const statusesWithCategory = await Status.find({ category: category.name });
  if (statusesWithCategory.length > 0) {
    res.status(400);
    throw new Error("Cannot delete category that is in use");
  }

  await category.deleteOne();
  res.json({ message: "Category removed" });
});

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name) {
    res.status(400);
    throw new Error("Category name is required");
  }

  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  const nameExists = await Category.findOne({ name });
  if (nameExists && nameExists._id.toString() !== req.params.id) {
    res.status(400);
    throw new Error("Category name already exists");
  }

  // Update statuses first (before renaming category to avoid mismatch)
  await Status.updateMany(
    { category: category.name },
    { $set: { category: name } }
  );

  category.name = name;
  const updatedCategory = await category.save();

  res.json(updatedCategory);
});

// @desc    Bulk create categories
// @route   POST /api/categories/bulk
// @access  Private/Admin
const bulkCreateCategories = asyncHandler(async (req, res) => {
  const { categories } = req.body;

  if (!Array.isArray(categories)) {
    res.status(400);
    throw new Error("Categories must be an array");
  }

  if (categories.length === 0) {
    res.status(400);
    throw new Error("No categories provided");
  }

  const createdCategories = [];
  const errors = [];

  for (const category of categories) {
    try {
      if (!category.name) {
        throw new Error("Category name is required");
      }

      const categoryExists = await Category.findOne({ name: category.name });
      if (categoryExists) {
        throw new Error(`Category "${category.name}" already exists`);
      }

      const newCategory = await Category.create({ name: category.name });
      createdCategories.push(newCategory);
    } catch (err) {
      errors.push({
        category,
        error: err.message,
      });
    }
  }

  if (createdCategories.length === 0) {
    res.status(400);
    throw new Error("All categories failed to create");
  }

  res.status(201).json({
    successCount: createdCategories.length,
    errorCount: errors.length,
    createdCategories,
    errors,
  });
});

export {
  getCategories,
  createCategory,
  deleteCategory,
  updateCategory,
  bulkCreateCategories,
};
