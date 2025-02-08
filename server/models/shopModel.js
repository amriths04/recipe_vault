import mongoose from 'mongoose';

const shopSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true
      },
      coordinates: {
        type: [Number],
        required: true,
        index: '2dsphere'
      }
    },
    ingredientsAvailable: {
      type: [String],
      default: []
    },
    contact: {
      phone: {
        type: String,
        required: true
      },
      email: {
        type: String,
        trim: true,
        lowercase: true
      }
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('Shop', shopSchema);
