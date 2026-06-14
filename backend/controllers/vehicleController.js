import Vehicle from "../models/Vehicle.js";

async function getVehicles(req, res) {
  try {
    const vehicles = await Vehicle.find({ user: req.user._id });
    return res.json(vehicles);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

async function createVehicle(req, res) {
  try {
    const { brand, model, year, plateNumber } = req.body;

    if (!brand || !model || !year || !plateNumber) {
      return res.status(400).json({
        message: "Marka, model, godina i registracija su obavezni.",
      });
    }

    if (Number(year) < 1980 || Number(year) > 2026) {
      return res.status(400).json({
        message: "Godina proizvodnje mora biti između 1980. i 2026.",
      });
    }

    const vehicle = await Vehicle.create({
      user: req.user._id,
      brand,
      model,
      year,
      plateNumber,
    });

    return res.status(201).json(vehicle);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

async function updateVehicle(req, res) {
  try {
    const vehicle = await Vehicle.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!vehicle) {
      return res.status(404).json({
        message: "Vozilo nije pronađeno.",
      });
    }

    vehicle.brand = req.body.brand || vehicle.brand;
    vehicle.model = req.body.model || vehicle.model;
    vehicle.year = req.body.year ?? vehicle.year;
    vehicle.plateNumber = req.body.plateNumber || vehicle.plateNumber;

    const updatedVehicle = await vehicle.save();

    return res.json(updatedVehicle);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

async function deleteVehicle(req, res) {
  try {
    const vehicle = await Vehicle.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!vehicle) {
      return res.status(404).json({
        message: "Vozilo nije pronađeno.",
      });
    }

    await vehicle.deleteOne();

    return res.json({
      message: "Vozilo je uspešno obrisano.",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

export { getVehicles, createVehicle, updateVehicle, deleteVehicle };