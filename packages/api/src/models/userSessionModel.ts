import mongoose, { Schema, model, type Document } from "mongoose";
export interface UserSession {
  userId: mongoose.Schema.Types.ObjectId;
  isValidSession: boolean;
  expiredAt?: Date;
  ipAddress: string;
  userAgent: string;
}

export interface UserSessionDocument extends UserSession, Document {
  createdAt: Date;
  updatedAt: Date;
}

const userSessionSchema = new Schema<UserSessionDocument>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    isValidSession: { type: Boolean, default: true },
    expiredAt: { type: Date },
    ipAddress: { type: String, required: true },
    userAgent: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

const _userSessionModel = model<UserSessionDocument>(
  "UserSession",
  userSessionSchema,
);
export default _userSessionModel;
