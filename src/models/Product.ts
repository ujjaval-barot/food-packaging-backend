import { Document, Schema, Types, model } from "mongoose";
import { ASSET_TYPES } from "../constants/enum";
import { IAsset } from "../types/custom";

export interface IProduct extends Document {
  name: string;
  description?: string;
  inStock: boolean;
  price: number; // <-- add
  discount?: number; // <-- add
  highlights: string[];
  specifications: {
    title: string;
    items: { name: string; value: string }[];
  }[];
  category: Types.ObjectId; // Parent category
  similarProducts?: Types.ObjectId[];
  isActive: boolean;
  isFeatured: boolean;
  isPopular: boolean;
  assets: IAsset[];
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: String,
    inStock: { type: Boolean, default: true },

    price: { type: Number, required: true }, // <-- add
    discount: { type: Number, default: 0 }, // <-- add

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
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    isPopular: { type: Boolean, default: false },
  },
  { timestamps: true }
);
export default model<IProduct>("Product", productSchema);
