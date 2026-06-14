import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

async function registerUser(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Ime, email i lozinka su obavezni.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Lozinka mora imati najmanje 6 karaktera.",
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "Korisnik sa ovom email adresom već postoji.",
      });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: "user",
    });

    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      city: user.city,
      token: generateToken(user._id),
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email i lozinka su obavezni.",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (user && (await user.matchPassword(password))) {
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        city: user.city,
        token: generateToken(user._id),
      });
    }

    return res.status(401).json({
      message: "Email ili lozinka nisu ispravni.",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

async function getUserProfile(req, res) {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "Korisnik nije pronađen.",
      });
    }

    return res.json(user);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

async function updateUserProfile(req, res) {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "Korisnik nije pronađen.",
      });
    }

    user.name = req.body.name || user.name;
    user.phone = req.body.phone ?? user.phone;
    user.city = req.body.city ?? user.city;

    if (req.body.password) {
      if (req.body.password.length < 6) {
        return res.status(400).json({
          message: "Lozinka mora imati najmanje 6 karaktera.",
        });
      }

      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    return res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      phone: updatedUser.phone,
      city: updatedUser.city,
      token: generateToken(updatedUser._id),
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

async function getUsers(req, res) {
  try {
    const users = await User.find({}).select("-password");

    return res.json(users);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

async function deleteUser(req, res) {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "Korisnik nije pronađen.",
      });
    }

    if (user.role === "admin") {
      return res.status(400).json({
        message: "Administrator ne može biti obrisan.",
      });
    }

    await user.deleteOne();

    return res.json({
      message: "Korisnik je uspešno obrisan.",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

export {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
};