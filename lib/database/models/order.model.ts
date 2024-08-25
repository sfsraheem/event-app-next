import { Schema, model, models, Document, Types } from "mongoose";

export interface IOrder extends Document {
  stripeId: string;
  totalAmount: string;
  event: Types.ObjectId;
  buyer: Types.ObjectId;
}

export type IOrderItem = {
  _id: string;
  totalAmount: string;
  createdAt: Date;
  eventTitle: string;
  eventId: string;
  buyer: string;
};

const OrderSchema = new Schema(
  {
    stripeId: {
      type: String,
      required: true,
      unique: true,
    },
    totalAmount: {
      type: String,
    },
    event: {
      type: Schema.Types.ObjectId,
      ref: "events",
    },
    buyer: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
  },
  {
    timestamps: true,
  }
);

const OrderModel = models.OrderModel || model("orders", OrderSchema);

export default OrderModel;
