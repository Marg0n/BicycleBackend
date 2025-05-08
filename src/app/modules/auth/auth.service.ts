import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import AppError from '../../errors/AppErrors';
import { TUser } from '../user/user.interface';
import { User } from '../user/user.model';
import { ILoginUser } from './auth.interface';
import { createToken } from './auth.utils';

// register a user
const register = async (payload: TUser) => {
  const result = await User.create(payload);
  return result;
};

// login a user
const login = async (payload: ILoginUser) => {
  const user = await User.findOne({
    email: payload.email,
  }).select('+password');

  if (!user) {
    throw new Error('User not found');
  }

  const userStatus = user?.status;
  if (userStatus === 'deactivate') {
    throw new Error('User is blocked');
  }

  const userPassword = user?.password;
  const isPasswordMatch = await bcrypt.compare(payload?.password, userPassword);

  if (!isPasswordMatch) {
    throw new Error('Password does not match');
  }

  if (!config.jwt_access_secret) {
    throw new Error('JWT secret is not defined');
  }

  const token = await createToken(
    { email: user?.email, role: user?.role },
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  const refreshToken = await createToken(
    { email: user?.email, role: user?.role },
    config.jwt_access_secret as string,
    config.jwt_refresh_expires_in as string,
  );

  // exclude the password field from the response
  const { password, ...verifiedUser } = user.toObject();

  const result = {
    token,
    refreshToken,
    user: verifiedUser,
  };

  return result;
};

// refresh token
const refreshToken = async (refreshToken: string) => {
  if (!config.jwt_access_secret) {
    throw new Error('Unauthorized user');
  }

  const decode = jwt.verify(refreshToken, config.jwt_access_secret) as {
    email: string;
    role: string;
  };

  const user = await User.findOne({ email: decode.email });

  if (!user) {
    throw new Error('User not found');
  }

  if (user?.status === 'deactivate') {
    throw new Error('User is blocked');
  }

  const token = createToken(
    { email: user.email, role: user.role },
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  const result = {
    token,
    user,
  };

  return result;
};

//change password

const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string },
) => {
  const user = await User.findOne({ email: userData.email }).select(
    '+password',
  );
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
  }

  const userStatus = user?.status;

  if (userStatus === 'deactivate') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!');
  }

  const isOldPasswordCorrect = await bcrypt.compare(
    payload.oldPassword,
    user.password,
  );
  if (!isOldPasswordCorrect) {
    throw new AppError(httpStatus.FORBIDDEN, 'The old password is incorrect');
  }

  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  );
  await User.findOneAndUpdate(
    { email: userData.email },
    {
      password: newHashedPassword,
      passwordChangedAt: new Date(),
      needsPasswordChange: false, // Update needsPasswordChange to false
    },
  );
  //  await User.findByIdAndUpdate(userData.email, {
  //     password: newHashedPassword,
  //     passwordChangedAt: new Date(),
  //   });
  const jwtPayload = {
    email: user?.email,
    role: user?.role,
  };

  const token = jwt.sign(jwtPayload, 'secret', { expiresIn: '1d' });

  return { token, user };
};

export const authService = {
  register,
  login,
  refreshToken,
  changePassword,
};
