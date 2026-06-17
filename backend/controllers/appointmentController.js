import Appointment from "../models/Appointment.js";
import Service from "../models/Service.js";
import Vehicle from "../models/Vehicle.js";

async function getMyAppointments(req, res) {
  try {
    const appointments = await Appointment.find({ user: req.user._id })
      .populate("vehicle", "brand model plateNumber year")
      .populate("service", "name category price duration")
      .sort({ date: 1, time: 1 });

    return res.json(appointments);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

function getTomorrowDateString() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const year = tomorrow.getFullYear();
  const month = String(tomorrow.getMonth() + 1).padStart(2, "0");
  const day = String(tomorrow.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

async function createAppointment(req, res) {
  try {
    const { vehicle, service, date, time, description } = req.body;

    if (!vehicle || !service || !date || !time) {
      return res.status(400).json({
        message: "Vozilo, usluga, datum i vreme su obavezni.",
      });
    }

    const minDate = getTomorrowDateString();

if (date < minDate) {
  return res.status(400).json({
    message: "Termin može biti zakazan najranije za sutrašnji datum.",
  });
}

    const existingVehicle = await Vehicle.findOne({
      _id: vehicle,
      user: req.user._id,
    });

    if (!existingVehicle) {
      return res.status(404).json({
        message: "Vozilo nije pronađeno.",
      });
    }

    const existingService = await Service.findById(service);

    if (!existingService) {
      return res.status(404).json({
        message: "Usluga nije pronađena.",
      });
    }

    const occupiedAppointment = await Appointment.findOne({
      date,
      time,
      status: { $ne: "otkazano" },
    });

    if (occupiedAppointment) {
      return res.status(400).json({
        message: "Izabrani termin je već zauzet.",
      });
    }

    const appointment = await Appointment.create({
      user: req.user._id,
      vehicle,
      service,
      date,
      time,
      description,
    });

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate("vehicle", "brand model plateNumber year")
      .populate("service", "name category price duration");

    return res.status(201).json(populatedAppointment);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function cancelAppointment(req, res) {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!appointment) {
      return res.status(404).json({
        message: "Zakazivanje nije pronađeno.",
      });
    }

    appointment.status = "otkazano";

    const updatedAppointment = await appointment.save();

    return res.json(updatedAppointment);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getAllAppointments(req, res) {
  try {
    const appointments = await Appointment.find({})
      .populate("user", "name email")
      .populate("vehicle", "brand model plateNumber year")
      .populate("service", "name category price duration")
      .sort({ date: 1, time: 1 });

    return res.json(appointments);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function updateAppointmentStatus(req, res) {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        message: "Zakazivanje nije pronađeno.",
      });
    }

    appointment.status = req.body.status || appointment.status;

    const updatedAppointment = await appointment.save();

    return res.json(updatedAppointment);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export {
  getMyAppointments,
  createAppointment,
  cancelAppointment,
  getAllAppointments,
  updateAppointmentStatus,
};