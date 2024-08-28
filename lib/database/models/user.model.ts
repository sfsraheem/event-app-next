import { model, models, Schema, Document } from "mongoose";

export interface IUser extends Document {
  clerkId: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  photo: string;
//   role: "organizer" | "attendee";
}

const UserSchema = new Schema<IUser>(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      required: true,
    },
    // role: {
    //   type: String,
    //   required: true,
    //   enum: ["organizer", "attendee"],
    // },
  },
  {
    timestamps: true,
    collection: "users",
  }
);

const UserModel = models.users || model<IUser>("users", UserSchema);

export default UserModel;
