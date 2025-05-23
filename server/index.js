import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import recipeRoutes from "./routes/recipe.routes.js";
import bookmarkRoutes from "./routes/bookmark.routes.js"
import shoppingListRoutes from "./routes/shoppingList.routes.js";
import ingredientRoutes from "./routes/ingredient.routes.js";
import orderRoutes from "./routes/order.routes.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/recipes",recipeRoutes)
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/shopping-list", shoppingListRoutes);
app.use("/api/ingredients", ingredientRoutes);
app.use("/api/orders", orderRoutes);
app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));