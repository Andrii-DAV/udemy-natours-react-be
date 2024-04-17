import { catchAsync } from '../utils/catchAsync';
import AppError from '../utils/appError';
import User from '../models/userModel';
import { filteredPropsOfObj } from '../utils/common';
import { deleteOne, getAll, getOne, updateOne } from './handlerFactory';
import multer from 'multer';
import sharp from 'sharp';

const multerStorage = multer.memoryStorage();
//@ts-ignore
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, file);
  } else {
    cb(new AppError('Not an image! Please upload only images', 400), false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

export const getAllUsers = getAll(User);
export const getUser = getOne(User);
export const updateUser = updateOne(User);
export const deleteUser = deleteOne(User);
export const getCurrentUser = getOne(User);

export const uploadUserPhoto = upload.single('photo');
export const resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  //@ts-ignore
  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);
  next();
});

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
  if (req.file) {
    //@ts-ignore
    filteredBody.photo = req.file.filename;
  }
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

export const setCurrentUserId = catchAsync(async (req, res, next) => {
  const { _id } = req.user;
  req.params.id = _id.toString();
  next();
});
