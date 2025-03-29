import mongoose from 'mongoose';

const locationSettingsSchema = new mongoose.Schema({
  enabled: {
    type: Boolean,
    default: false,
  },
  latitude: {
    type: Number,
    required: function(this: { enabled: boolean }) {
      return this.enabled;
    },
  },
  longitude: {
    type: Number,
    required: function(this: { enabled: boolean }) {
      return this.enabled;
    },
  },
  radius: {
    type: Number,
    required: function(this: { enabled: boolean }) {
      return this.enabled;
    },
    min: 1,
    default: 100, // default 100 meters
  },
});

const mintLinkSchema = new mongoose.Schema({
  dropId: {
    type: String,
    required: true,
  },
  uniqueId: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  isUsed: {
    type: Boolean,
    default: false,
  },
  usedBy: {
    type: String,
  },
  usedAt: {
    type: Date,
  },
  locationSettings: {
    type: locationSettingsSchema,
    default: { enabled: false },
  },
});

export const MintLink = mongoose.models.MintLink || mongoose.model('MintLink', mintLinkSchema); 