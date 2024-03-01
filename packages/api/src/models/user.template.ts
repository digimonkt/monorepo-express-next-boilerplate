import { Schema, model, type Document } from "mongoose";
import bcrypt from "bcrypt";
export interface User {
  username: string;
  email: string;
  password: string; // Store the hashed password
  firstName: string;
  lastName: string;
  isVerifiedEmail: boolean;
  isLocked: boolean;
}

export interface UserDocument extends User, Document {
  createdAt: Date;
  updatedAt: Date;
  updatePassword: (newPassword: string) => Promise<void>;
  comparePassword: (candidatePassword: string) => Promise<boolean>;
}

const userSchema = new Schema<UserDocument>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
    return;
  }
  try {
    const hashed = await bcrypt.hash(this.get("password"), 10);
    this.set("password", hashed);
    next();
  } catch (err: any) {
    next(err);
  }
});

userSchema.methods.updatePassword = async function (newPassword: string) {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  this.password = hashedPassword; // Update the hashed password
  await this.save(); // Save the updated user document
};

userSchema.methods.comparePassword = async function (
  candidatePassword: string,
) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

const _userModel = model<UserDocument>("User", userSchema);
export default _userModel;
