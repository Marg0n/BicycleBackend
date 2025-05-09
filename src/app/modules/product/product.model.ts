import { Document, Schema, model } from 'mongoose';
import { ProductModel, TProduct } from './product.interface';

export interface Product extends Document {
  name: string;
  brand: string;
  price: number;
  type: 'Mountain' | 'Road' | 'Hybrid' | 'BMX' | 'Electric';
  description: string;
  quantity: number;
  inStock: boolean;
  createdAt: Date;
  updatedAt: Date;
  isProductExists(id: string): Promise<boolean>;
}

const productSchema = new Schema<TProduct>(
  {
    name: { type: String, required: [true, 'Name is required'] },
    brand: { type: String, required: [true, 'Brand is required'] },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price must be a positive number'],
    },
    Img: { type: String, default: '' },
    type: {
      type: String,
      enum: ['Mountain', 'Road', 'Hybrid', 'BMX', 'Electric', 'Fat Bikes'],
      required: [true, 'Bicycle type is required'],
    },
    description: { type: String, required: [true, 'Description is required'] },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity must be a positive number'],
    },
    inStock: { type: Boolean, default: true },
    rating: { 
      type: Number,
      // required: [true, 'Please provide a rating.'],
      min: [1, 'Rating cannot be less than 1.'],
      max: [5, 'Rating cannot be more than 5.'],
      default: 3,
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

productSchema.methods.isProductExists = async function (id: string) {
  const product = await this.model('Product').findById(id);
  return product !== null;
};

export const Product = model<TProduct>('Product', productSchema);

const ProductModel = model('Product', productSchema);

export default ProductModel;
