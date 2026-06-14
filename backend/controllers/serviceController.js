import Service from "../models/Service.js";

async function getServices(req, res) {
  try {
    const services = await Service.find({});
    return res.json(services);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

async function getServiceById(req, res) {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        message: "Usluga nije pronađena.",
      });
    }

    return res.json(service);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

async function createService(req, res) {
  try {
    const { name, category, description, price, duration, includes } = req.body;

    if (!name || !category || !description || !price || !duration) {
      return res.status(400).json({
        message: "Naziv, kategorija, opis, cena i trajanje su obavezni.",
      });
    }

    const service = await Service.create({
      name,
      category,
      description,
      price,
      duration,
      includes: includes || [],
    });

    return res.status(201).json(service);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

async function updateService(req, res) {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        message: "Usluga nije pronađena.",
      });
    }

    service.name = req.body.name || service.name;
    service.category = req.body.category || service.category;
    service.description = req.body.description || service.description;
    service.price = req.body.price ?? service.price;
    service.duration = req.body.duration ?? service.duration;
    service.includes = req.body.includes || service.includes;

    const updatedService = await service.save();

    return res.json(updatedService);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

async function deleteService(req, res) {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        message: "Usluga nije pronađena.",
      });
    }

    await service.deleteOne();

    return res.json({
      message: "Usluga je uspešno obrisana.",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

export {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
};