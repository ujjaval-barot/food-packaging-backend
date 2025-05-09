import { Schema, model, Document, Types } from "mongoose";

export interface ICategory extends Document {
  name: string;
  description?: string;
  parentCategory?: string;
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true },
    description: String,
    parentCategory: { type: Types.ObjectId, ref: "Category", default: null },
  },
  { timestamps: true }
);

export default model<ICategory>("Category", categorySchema);
