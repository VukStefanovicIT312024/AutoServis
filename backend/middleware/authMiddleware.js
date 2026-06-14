import jwt from "jsonwebtoken";
import User from "../models/User.js";

async function protect(req, res, next) {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      return res.status(401).json({
        message: "Niste autorizovani, token nije ispravan.",
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      message: "Niste autorizovani, nema tokena.",
    });
  }
}

function admin(req, res, next) {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({
      message: "Niste autorizovani kao administrator.",
    });
  }
}

export { protect, admin };