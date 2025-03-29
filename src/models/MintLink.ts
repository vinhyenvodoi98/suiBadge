import mongoose from 'mongoose';

const mintLinkSchema = new mongoose.Schema({
  dropId: { type: mongoose.Schema.Types.ObjectId, ref: 'Drop', required: true },
  uniqueId: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
  isUsed: { type: Boolean, default: false },
  usedBy: { type: String },
  usedAt: { type: Date }
});

export const MintLink = mongoose.models.MintLink || mongoose.model('MintLink', mintLinkSchema); 