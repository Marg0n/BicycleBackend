/* eslint-disable @typescript-eslint/no-this-alias */
import bcrypt from 'bcrypt';
import mongoose, { Schema, model } from 'mongoose';
import config from '../../config';
import { UserStatus } from './user.constant';
import { TUser, UserModel } from './user.interface';

export const userSchema = new Schema<TUser, UserModel>(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      unique: true,
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    needsPasswordChange: {
      type: Boolean,
      default: true,
    },
    passwordChangedAt: {
      type: Date,
    },
    role: {
      type: String,
      enum: ['customer', 'admin'],
      default: 'customer',
      required: true,
    },
    status: {
      type: String,
      enum: UserStatus,
      default: 'active',
    },
    image: {
      type: String,
    },
    address: {
      type: String,
    },
    phone: {
      type: String,
    },
    bloodGroup: {
      type: String,
    },
    emergencyContact: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);
userSchema.pre('save', async function (next) {
  const user = this;

  //* hashing password and save into DB
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  );

  next();
});

//? set '' after saving password
userSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

userSchema.statics.isUserExistsByCustomId = async function (id: string) {
  return await User.findOne({ id }).select('+password');
};

userSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

userSchema.statics.isJWTIssuedBeforePasswordChanged = function (
  passwordChangedTimestamp: Date,
  jwtIssuedTimestamp: number,
) {
  const passwordChangedTime =
    new Date(passwordChangedTimestamp).getTime() / 1000;
  return passwordChangedTime > jwtIssuedTimestamp;
};

userSchema.methods.comparePassword = async function (enteredPassword: string) {
  if (!this.password) {
    throw new Error('Password is not set for this user.');
  }
  return await bcrypt.compare(enteredPassword, this.password);
};
export const User = model<TUser, UserModel>('User', userSchema);
