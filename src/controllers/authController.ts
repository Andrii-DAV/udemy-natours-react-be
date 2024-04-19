import User, { IUser, type MongooseId, UserRole } from '../models/userModel';
import { catchAsync } from '../utils/catchAsync';
import jwt, { JwtPayload } from 'jsonwebtoken';
import AppError from '../utils/appError';
import { Email } from '../utils/email';
import * as crypto from 'crypto';
import express from 'express';
import { getHeaderToken, REDIRECT_PROTECTED_PAGES } from '../utils/auth';

const signToken = (id: MongooseId) =>
  jwt.sign(
    {
      id: id,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN },
  );

async function jwtVerify(
  token: string,
  secret: string,
): Promise<string | JwtPayload> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) return reject(err);
      resolve(decoded);
    });
  });
}

const createSendToken = (
  user: IUser,
  statusCode: number,
  res: express.Response,
) => {
  const token = signToken(user._id);

  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() +
        Number(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000,
    ),
    secure: process.env.NODE_ENV !== 'development',
    httpOnly: true, //receive - store - send automatically
  });

  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    data: user,
    token,
  });
};
export const signup = catchAsync(async (req, res) => {
  const { name, email, password, passwordConfirm } = req.body;

  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm,
  });

  const url = `${req.protocol}://${req.get('host')}/me`;
  await new Email(newUser, url).sendWelcome();
  createSendToken(newUser, 201, res);
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('incorrect email or password', 401));
  }
  createSendToken(user, 200, res);
});

export const logout = catchAsync(async (req, res) => {
  res.cookie('jwt', '', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    status: 'success',
  });
});

export const isLoggedIn = catchAsync(async (req, res, next) => {
  if (!req.cookies.jwt) {
    return next();
  }
  // eslint-disable-next-line
  // @ts-ignore
  const { id, iat } = await jwtVerify(req.cookies.jwt, process.env.JWT_SECRET);

  const foundUser = await User.findById(id);

  if (!foundUser) return next();

  // eslint-disable-next-line
  // @ts-ignore
  if (foundUser.changedPasswordAfter(iat)) return next();

  res.locals.user = foundUser;
  next();
});

export const protect = catchAsync(async (req, res, next) => {
  const token = getHeaderToken(req);
  if (!token) {
    return REDIRECT_PROTECTED_PAGES.includes(req.route.path)
      ? res.redirect('/login')
      : next(new AppError('Please log in to get access.', 401));
  }
  // eslint-disable-next-line
  // @ts-ignore
  const { id, iat } = await jwtVerify(token, process.env.JWT_SECRET);

  const foundUser = await User.findById(id);
  if (!foundUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist',
        401,
      ),
    );
  }
  // eslint-disable-next-line
  // @ts-ignore
  if (foundUser.changedPasswordAfter(iat)) {
    return next(new AppError('User recently changed password!', 401));
  }
  req.user = foundUser;
  res.locals.user = foundUser;
  next();
});

export const restrictTo = (...roles: UserRole[]) =>
  catchAsync(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403),
      );
    }

    next();
  });

export const forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with email address', 404));
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    'host',
  )}/api/v1/users/resetPassword/${resetToken}`;

  try {
    await new Email(user, resetURL).sendPasswordReset();

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (e) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError(
        'There was an error sending the email. Try again later!',
        500,
      ),
    );
  }
});
export const resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  createSendToken(user, 200, res);
});

export const updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).select('+password');
  const { oldPassword, newPassword, passwordConfirm } = req.body;

  if (!oldPassword || !passwordConfirm || !newPassword) {
    return next(new AppError('Required fields are missing.', 400));
  }

  if (!(await user.correctPassword(oldPassword, user.password))) {
    return next(new AppError('Wrong passwords.', 400));
  }

  user.password = newPassword;
  user.passwordConfirm = passwordConfirm;

  await user.save();

  createSendToken(user, 200, res);
});
