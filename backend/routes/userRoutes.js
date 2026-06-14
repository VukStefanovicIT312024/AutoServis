import express from "express";
import {
  deleteUser,
  getUserProfile,
  getUsers,
  loginUser,
  registerUser,
  updateUserProfile,
} from "../controllers/userController.js";
import { admin, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.route("/").get(protect, admin, getUsers);
router.route("/:id").delete(protect, admin, deleteUser);

export default router;