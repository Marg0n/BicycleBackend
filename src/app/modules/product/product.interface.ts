import { Model } from 'mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';


  export interface TProduct extends Document {
    name: string;
    Img?: string;
    brand: string;
    price: number;
    type: "Mountain" | "Road" | "Hybrid" | "BMX" | "Electric" | "Fat Bikes" ;
    description: string;
    quantity: number;
    inStock: boolean;
    rating?: number;
    isDeleted?: boolean;
  }

  export interface ProductModel extends Model<TProduct> {
    calculateTotalPrice(productId: Types.ObjectId, quantity: number): Promise<number>; 
    isUserExists(id: string): Promise<TProduct | null>;  
  }
