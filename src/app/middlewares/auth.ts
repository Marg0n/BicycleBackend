import { NextFunction, Request, Response } from 'express';
import HttpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { User } from '../modules/user/user.model';
import catchAsync from '../utils/catchAsync';
import { TUserRole } from '../modules/user/user.interface';
import AppError from '../errors/AppErrors';

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // console.log(req.headers);
    const token = req.headers.authorization?.split(' ')[1];
    const secret = config.jwt_access_secret;
    // console.log('token', token);
    // console.log('secret', secret);

    if (!token) {
      throw new AppError(HttpStatus.UNAUTHORIZED, 'You are not authorized!😎');
    }

    let decode: any;
    try {
      decode = jwt.verify(
        token,
        config.jwt_access_secret as string,
      ) as JwtPayload;
    } catch (err) {
      throw new AppError(HttpStatus.UNAUTHORIZED, 'UNAUTHORIZED');
    }
    // console.log('decoded token:', decode);

    const { role, email, userId, iat } = decode;
    const user = await User.findOne({ email }).select('status role');

    if (!user) {
      throw new AppError(HttpStatus.NOT_FOUND, 'This user is not found !');
    }

    const userStatus = user?.status;

    if (userStatus === 'inactive') {
      throw new AppError(HttpStatus.FORBIDDEN, 'This user is inactive!');
    }

    if (
      user.passwordChangedAt &&
      User.isJWTIssuedBeforePasswordChanged(
        user.passwordChangedAt,
        iat as number,
      )
    ) {
      throw new AppError(
        HttpStatus.UNAUTHORIZED,
        'You are not authorized for it!',
      );
    }

    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(
        HttpStatus.UNAUTHORIZED,
        'You are not authorized  hi!',
      );
    }

    req.user = decode as JwtPayload;

    next();
  });
};

export default auth;
