import mongoose from "mongoose";

const { Schema, model } = mongoose;

const IngredientSchema = new Schema({
  name: { type: String, required: true },
  quantity: { type: String, required: true },
  price: { type: Number, required: true },
});

const OrderItemSchema = new Schema({
  recipe: { type: Schema.Types.ObjectId, ref: "Recipe", required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  ingredients: [IngredientSchema],
});

const OrderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [OrderItemSchema],
    deliveryAddress: { type: String, required: true },
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const Order = model("Order", OrderSchema);
export default Order;
