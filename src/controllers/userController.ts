import { catchAsync } from '../utils/catchAsync';
import AppError from '../utils/appError';
import User from '../models/userModel';
import { filteredPropsOfObj } from '../utils/common';
import { deleteOne, getAll, getOne, updateOne } from './handlerFactory';

export const getAllUsers = getAll(User);
export const getUser = getOne(User);
export const updateUser = updateOne(User);
export const deleteUser = deleteOne(User);

export const updateCurrentUser = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use updatePassword',
        400,
      ),
    );
  }

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
