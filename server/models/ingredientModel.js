import mongoose from "mongoose";

const IngredientSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  unit: { type: String, required: true }, // kg, litre, etc.
  pricePerUnit: { type: Number, required: true },
});

export default mongoose.model("Ingredient", IngredientSchema);
