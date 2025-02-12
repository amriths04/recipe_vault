import mongoose from "mongoose";

const { Schema, model } = mongoose;

const RecipeSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    image: { type: String, default: "https://via.placeholder.com/300" }, // Placeholder image
    ingredients: [
      {
        name: { type: String, required: true },
        quantity: { type: String, required: true },
        notes: { type: String },
      },
    ],
    procedure: { type: [String], required: true },
    characteristics: {
      type: { type: String, required: true },
      diet: { type: String, required: true },
      spiciness: { type: String },
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    favoritedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const Recipe = model("Recipe", RecipeSchema);
export default Recipe;
