import express from "express";
import { unbookmarkRecipes } from "../controllers/bookmarkController.js";
import { verifyJWT } from "../middleware/auth.middleware.js"; // Updated middleware

const router = express.Router();

router.delete("/unbookmark", verifyJWT, unbookmarkRecipes);

export default router;
