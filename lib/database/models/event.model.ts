import { model, models, Schema, Document, Types } from "mongoose";

export interface IEvent extends Document {
  title: string;
  description: string;
  location: string;
  imageUrl: string;
  startDateTime: Date;
  endDateTime: Date;
  price: string;
  isFree: boolean;
  url: string;
  category: Types.ObjectId;
  organizer: Types.ObjectId;
}

const EventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    location: String,
    imageUrl: {
      type: String,
      required: true,
    },
    startDateTime: {
      type: Date,
      required: true,
    },
    endDateTime: {
      type: Date,
      required: true,
    },
    price: String,
    isFree: {
      type: Boolean,
      required: true,
    },
    url: String,
    category: {
      type: Schema.Types.ObjectId,
      ref: "categories",
    },
    organizer: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
  },
  {
    timestamps: true,
  }
);

const EventModel = models.EventModel || model<IEvent>("events", EventSchema);

export default EventModel;
