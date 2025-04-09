import mongoose from "mongoose";

const { Schema, model } = mongoose;

const IngredientSchema = new Schema(
  {
    name: { type: String, required: true },
    quantity: { type: String, required: true },
    price: { type: Number, required: true },
  },
  { _id: false }  // Disable the _id field for ingredients
);

const OrderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    ingredients: [IngredientSchema],  // Move ingredients to the top level
    deliveryAddress: { type: String, required: true },
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    recipeIds: [{ type: Schema.Types.ObjectId, ref: "Recipe" }],  // Store the recipeIds here
  },
  { timestamps: true }
);

const Order = model("Order", OrderSchema);
export default Order;
