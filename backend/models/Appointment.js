import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    service: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Service",
    },

    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Vehicle",
    },

    date: {
      type: String,
      required: true,
    },

    time: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["Zakazano", "U obradi", "Završeno", "Otkazano"],
      default: "Zakazano",
    },
  },
  {
    timestamps: true,
  }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;