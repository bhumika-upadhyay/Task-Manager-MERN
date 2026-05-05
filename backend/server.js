
// ---------------- MODULES IMPORT ----------------


import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
// ---------------- CONFIG ----------------
// dotenv.config({ path: "./.env" });

// ---------------- DB CONNECT ----------------
import connectDB from "./config/db.js";
 // ---------------- ROUTES ----------------
import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/task.routes.js";
import stateRoutes from "./routes/state.routes.js";
import countryRoutes from "./routes/country.routes.js";
import cityRoutes from "./routes/city.routes.js";
import userRoutes from "./routes/user.routes.js";
// ---------------- APP INIT ----------------
const app = express();
// ---------------- MIDDLEWARE ----------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
// serve uploaded files
app.use("/uploads", express.static(path.resolve("uploads")));
// ---------------- ROUTES ----------------
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/states", stateRoutes);
app.use("/api/country", countryRoutes);
app.use("/api/cities", cityRoutes);

// ---------------- TEST ROUTE ----------------
app.get("/", (req, res) => {
  res.send("Server Running");
});
//----------------- server------------------
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});