import { model, Schema } from 'mongoose';
import { TOrder, TOrderedItem } from './order.interface';
import { Status } from './order.constant';

const orderedItem = new Schema<TOrderedItem>({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const orderSchema = new Schema<TOrder>(
  {
    products: [orderedItem],
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    totalPrice: Number,
    isDeleted: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      required: true,
      enum: Status,
    },
    transactionId: {
      type: String,
    },
    paymentStatus: {
      type: String,
      enum: ['UNPAID', 'PAID'],
      default: 'UNPAID',
    },
    contact: {
      type: String,
    },
    deliveryAddress: {
      type: String,
    }
  },
  {
    timestamps: true,
  },
);

export const Order = model<TOrder>('Order', orderSchema);
