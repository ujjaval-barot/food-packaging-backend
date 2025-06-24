import { Document, Schema, model } from "mongoose";
import { ASSET_TYPES } from "../constants/enum";
import { IAsset } from "../types/custom";

export interface IBlog extends Document {
  _id: string;
  title: string;
  description?: string;
  isActive: boolean;
  content: string;
  assets: IAsset[];
}

const blogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    content: { type: String, required: true },
    assets: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
        type: { type: String, enum: ASSET_TYPES, required: true },
      },
    ],
  },
  { timestamps: true }
);

export default model<IBlog>("Blog", blogSchema);
