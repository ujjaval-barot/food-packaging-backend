import { Schema, model, Document, Types } from "mongoose";
import { ICategory } from "./Category";
import { ASSET_TYPES } from "../constants/enum";
import { IAsset } from "../types/custom";

export interface IProduct extends Document {
  name: string;
  description?: string;
  inStock: boolean;
  highlights: string[];
  specifications: {
    title: string;
    items: { name: string; value: string }[];
  }[];
  category: Types.ObjectId; // Parent category
  similarProducts?: Types.ObjectId[];
  assets: IAsset[];
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: String,
    inStock: { type: Boolean, default: true },
    assets: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
        type: { type: String, enum: ASSET_TYPES, required: true },
      },
    ],
    highlights: [{ type: String }],
    specifications: [
      {
        title: { type: String },
        items: [
          {
            name: { type: String },
            value: { type: String },
          },
        ],
      },
    ],
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    similarProducts: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true }
);

export default model<IProduct>("Product", productSchema);
