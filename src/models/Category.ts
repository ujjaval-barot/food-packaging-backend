import { Schema, model, Document, Types } from "mongoose";
import { CategoryLabel, IAsset } from "../types/custom";
import { ASSET_TYPES, TAGS } from "../constants/enum";

export interface ICategory extends Document {
  _id: string;
  name: string;
  description?: string;
  parentCategory?: string;
  isActive: boolean;
  labels?: CategoryLabel[];
  productCount: number;
  assets: IAsset[];
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true },
    description: String,
    parentCategory: { type: Types.ObjectId, ref: "Category", default: null },
    labels: [{ type: String, enum: TAGS }],
    productCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }, // 👈 add this
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

export default model<ICategory>("Category", categorySchema);
