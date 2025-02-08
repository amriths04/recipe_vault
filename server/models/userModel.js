import mongoose from "mongoose";

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
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;