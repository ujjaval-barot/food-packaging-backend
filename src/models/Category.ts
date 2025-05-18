import { Schema, model, Document, Types } from "mongoose";
import { CategoryLabel, IAsset } from "../types/custom";
import { ASSET_TYPES, TAGS } from "../constants/enum";

export interface ICategory extends Document {
  name: string;
  description?: string;
  parentCategory?: string;
  labels?: CategoryLabel[];
  assets: IAsset[];
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true },
    description: String,
    parentCategory: { type: Types.ObjectId, ref: "Category", default: null },
    labels: [{ type: String, enum: TAGS }],
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
