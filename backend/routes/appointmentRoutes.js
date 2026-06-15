import express from "express";
import {
  cancelAppointment,
  createAppointment,
  getAllAppointments,
  getMyAppointments,
  updateAppointmentStatus,
} from "../controllers/appointmentController.js";
import { admin, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .get(protect, getMyAppointments)
  .post(protect, createAppointment);

router
  .route("/admin")
  .get(protect, admin, getAllAppointments);

router
  .route("/:id/cancel")
  .put(protect, cancelAppointment);

router
  .route("/:id/status")
  .put(protect, admin, updateAppointmentStatus);

export default router;