import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      console.log("TOKEN RECEIVED:", token); // ✅ debug

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("DECODED TOKEN:", decoded); // ✅ debug

      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      next();
    } catch (err) {
      console.error(err);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    console.log("No token in headers");
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

export default protect;