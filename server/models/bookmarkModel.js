import mongoose from "mongoose";

const { Schema, model } = mongoose;

const BookmarkSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    recipe: { type: Schema.Types.ObjectId, ref: "Recipe", required: true },
  },
  {
    timestamps: true,
  }
);

const Bookmark = model("Bookmark", BookmarkSchema);
export default Bookmark;
