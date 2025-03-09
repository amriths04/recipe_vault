import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import recipeRoutes from "./routes/recipe.routes.js";
import bookmarkRoutes from "./routes/bookmark.routes.js"
dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/recipes",recipeRoutes)
app.use("/api/bookmarks", bookmarkRoutes);
app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));