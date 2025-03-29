import mongoose from 'mongoose';

const dropSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  maxSupply: { type: Number, required: true },
  userAddress: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const Drop = mongoose.models.Drop || mongoose.model('Drop', dropSchema); 