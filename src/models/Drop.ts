import mongoose from 'mongoose';

const whitelistEntrySchema = new mongoose.Schema({
  address: { type: String, required: true },
  addedAt: { type: Date, default: Date.now }
});

const mintConfigSchema = new mongoose.Schema({
  type: { type: String, enum: ['link', 'whitelist'], required: true },
  mintLink: { type: String },
  whitelist: [whitelistEntrySchema]
});

const dropSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  maxSupply: { type: Number, required: true },
  userAddress: { type: String, required: true },
  mintConfig: mintConfigSchema,
  createdAt: { type: Date, default: Date.now }
});

export const Drop = mongoose.models.Drop || mongoose.model('Drop', dropSchema); 