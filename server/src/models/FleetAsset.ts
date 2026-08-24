import mongoose from 'mongoose'

const { Schema, model, models } = mongoose

const tyreSpecificationsSchema = new Schema(
  {
    tyreSize: { type: String, required: true, trim: true },
    construction: {
      type: String,
      required: true,
      enum: ['Radial', 'Bias', 'Diagonal'],
      trim: true,
    },
    pattern: { type: String, trim: true, default: '' },
    loadIndex: { type: String, trim: true, default: '' },
    speedRating: { type: String, trim: true, default: '' },
    plyRating: { type: String, trim: true, default: '' },
    tubeType: {
      type: String,
      required: true,
      enum: ['Tubeless', 'Tube Type'],
      trim: true,
    },
  },
  { _id: false }
)

const fleetAssetSchema = new Schema(
  {
    assetCode: { type: String, required: true, trim: true, unique: true, index: true },
    assetName: { type: String, required: true, trim: true },
    assetType: { type: String, required: true, trim: true, default: 'Tyre' },
    brand: { type: String, required: true, trim: true },
    model: { type: String, required: true, trim: true },
    status: {
      type: String,
      required: true,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
    description: { type: String, trim: true, default: '' },
    tyreSpecifications: { type: tyreSpecificationsSchema, required: true },
  },
  { timestamps: true }
)

export const FleetAsset = models.FleetAsset || model('FleetAsset', fleetAssetSchema)
