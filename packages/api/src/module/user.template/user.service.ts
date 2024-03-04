import type mongoose from "mongoose";
import { type FilterQuery } from "mongoose";
import { UserModel } from "../../models";
import { type User, type UserDocument } from "../../models/user.template";

export class UserService {
  public async findById(id: string | mongoose.Schema.Types.ObjectId) {
    const user = await UserModel.findById(id);
    return user;
  }

  public async findOneWithOptions(options: FilterQuery<UserDocument>) {
    const user = await UserModel.findOne(options);
    return user;
  }

  public async create(user: User) {
    const newUser = await UserModel.create(user);
    return newUser;
  }

  public async updateById(
    id: string | mongoose.Schema.Types.ObjectId,
    updates: Partial<User>,
  ) {
    const updatedUser = await UserModel.findByIdAndUpdate(id, updates, {
      new: true,
    });
    return updatedUser;
  }

  public async deleteById(id: mongoose.Schema.Types.ObjectId | string) {
    const deletedUser = await UserModel.findByIdAndDelete(id);
    return deletedUser;
  }
}
