/* eslint-disable no-unused-vars */
import { USER_ROLE } from './user.constant';
import { Model } from 'mongoose';


export interface TUser {
  name: string;
  email: string;
  password: string;
  needsPasswordChange: boolean;
  passwordChangedAt?: Date;
  role:  'admin' | 'customer' ;
  status: 'active' | 'deactivate';
  image?: string;
  address?: string;
  phone?: string;
  bloodGroup?: string;
  emergencyContact?: string;
}

export interface UserModel extends Model<TUser> {
  isUserExistsByCustomId(id: string): Promise<TUser>;
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number,
  ): boolean;
}

export type TUserRole = keyof typeof USER_ROLE;