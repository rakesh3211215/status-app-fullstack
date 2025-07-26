import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import Status from "../models/Status.js";

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select("-password");
  res.json(users);
});

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
const updateUserRole = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.role = req.body.role;
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Get all statuses
// @route   GET /api/admin/statuses
// @access  Private/Admin
const getAllStatuses = asyncHandler(async (req, res) => {
  const statuses = await Status.find().populate("user", "name email");
  res.json(statuses);
});

export { getAllUsers, updateUserRole, getAllStatuses };
