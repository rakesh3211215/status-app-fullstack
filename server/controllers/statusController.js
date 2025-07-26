import Status from "../models/Status.js";
import asyncHandler from "express-async-handler";

/**
 * @desc    Create a new status
 * @route   POST /api/status
 * @access  Private
 */
const createStatus = asyncHandler(async (req, res) => {
  const { title, description, category } = req.body;

  if (!title || !description || !category) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const status = await Status.create({
    title,
    description,
    category,
    user: req.user.id,
  });

  res.status(201).json(status);
});

// /**
//  * @desc    Get all statuses
//  * @route   GET /api/status
//  * @access  Public
//  */
// const getStatuses = asyncHandler(async (req, res) => {
//   const statuses = await Status.find().populate("user", "name email");
//   res.json(statuses);
// });

/**
 * @desc    Get all statuses with pagination, search, and filtering
 * @route   GET /api/status
 * @access  Public
 */
const getStatuses = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, category, search } = req.query;

  const query = {};

  // If specific category is selected
  if (category && category !== "all") {
    query.category = category;
  }

  // If search term is present, match in title, description, or category
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { category: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [statuses, total] = await Promise.all([
    Status.find(query)
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    Status.countDocuments(query),
  ]);

  res.json({
    statuses,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: parseInt(page),
  });
});

/**
 * @desc    Get all unique status categories
 * @route   GET /api/status/categories
 * @access  Public
 */
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Status.distinct("category");
  res.json(categories);
});

/**
 * @desc    Update a status by ID
 * @route   PUT /api/status/:id
 * @access  Private
 */
const updateStatus = asyncHandler(async (req, res) => {
  const status = await Status.findById(req.params.id);

  if (!status) {
    res.status(404);
    throw new Error("Status not found");
  }

  if (status.user.toString() !== req.user.id && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to update this status");
  }

  const updatedStatus = await Status.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.json(updatedStatus);
});

/**
 * @desc    Delete a status by ID
 * @route   DELETE /api/status/:id
 * @access  Private
 */
const deleteStatus = asyncHandler(async (req, res) => {
  try {
    const status = await Status.findById(req.params.id);

    if (!status) {
      res.status(404);
      throw new Error("Status not found");
    }

    const statusUserId = status.user?.toString();

    if (
      !statusUserId ||
      (statusUserId !== req.user.id && req.user.role !== "admin")
    ) {
      res.status(403);
      throw new Error("Not authorized to delete this status");
    }

    await status.deleteOne();

    res.status(200).json({ message: "Status deleted successfully" });
  } catch (err) {
    console.error("❌ Delete Error:", err.message);
    res.status(500).json({ message: "Server error: " + err.message });
  }
});

/**
 * @desc    Add a category (virtual - just echoes back)
 * @route   POST /api/status/categories
 * @access  Private
 */
const addCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name) {
    res.status(400);
    throw new Error("Category name is required");
  }

  // No actual DB model exists; just echoing for now
  res.status(201).json({ name });
});

/**
 * @desc    Delete a category if not in use
 * @route   DELETE /api/status/categories/:name
 * @access  Private
 */
const deleteCategory = asyncHandler(async (req, res) => {
  const categoryName = req.params.name;

  const inUse = await Status.exists({ category: categoryName });

  if (inUse) {
    res.status(400);
    throw new Error("Cannot delete category that is in use");
  }

  // No actual deletion in DB since categories are derived from Status
  res.json({ message: `Category '${categoryName}' deleted` });
});

export {
  createStatus,
  getStatuses,
  getCategories,
  updateStatus,
  deleteStatus,
  addCategory,
  deleteCategory,
};
