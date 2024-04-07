import { Request } from '../types/Request';
import express from 'express';
import { catchAsync } from '../utils/catchAsync';
import AppError from '../utils/appError';
import User from '../models/userModel';
import { filteredPropsOfObj } from '../utils/common';

export const getAllUsers = (req: Request, res: express.Response) => {
  res.status(500).json({
    status: 'error',
    message: 'Not yet defined',
  });
};
export const createUser = (req: Request, res: express.Response) => {
  res.status(500).json({
    status: 'error',
    message: 'Not yet defined',
  });
};
export const getUser = (req: Request, res: express.Response) => {
  res.status(500).json({
    status: 'error',
    message: 'Not yet defined',
  });
};
export const updateUser = (req: Request, res: express.Response) => {
  res.status(500).json({
    status: 'error',
    message: 'Not yet defined',
  });
};
export const deleteUser = (req: Request, res: express.Response) => {
  res.status(500).json({
    status: 'error',
    message: 'Not yet defined',
  });
};

export const updateCurrentUser = catchAsync(async (req, res, next) => {
  // 1) Create error if user POST password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use updatePassword',
        400,
      ),
    );
  }

  // 2) Update user document
  const filteredBody = filteredPropsOfObj(req.body, 'name', 'email');
  const updated = await User.findByIdAndUpdate(req.user._id, filteredBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    data: updated,
  });
});

export const deleteCurrentUser = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, {
    active: false,
  });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
