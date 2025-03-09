// models/UserModel.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, unique: true, sparse: true },
    password: { type: String, required: true }, // Will be hashed
    profile: {
      name: { type: String },
      dob: { type: Date },
      location: { type: String },
    },
    refreshToken: { type: String },

    // ✅ Add these two arrays
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
    shoppingList: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
  },
  { timestamps: true }
);

// 🔹 Hash password before saving to DB
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// 🔹 Compare passwords
userSchema.methods.isPasswordCorrect = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export { User };
