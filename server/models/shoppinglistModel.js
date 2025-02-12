import mongoose from "mongoose";

const { Schema, model } = mongoose;

const ShoppingListSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        name: { type: String, required: true },
        quantity: { type: String, required: true },
        checked: { type: Boolean, default: false },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const ShoppingList = model("ShoppingList", ShoppingListSchema);
export default ShoppingList;
