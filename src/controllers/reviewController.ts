import { catchAsync } from '../utils/catchAsync';
import Review from '../models/reviewModel';
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from './handlerFactory';

export const getReviews = getAll(Review);
export const getReview = getOne(Review);
export const deleteReview = deleteOne(Review);
export const updateReview = updateOne(Review);
export const createReview = createOne(Review);

export const setTourUserIds = catchAsync(async (req, res, next) => {
  const { _id: userId } = req.user;
  const { tourId } = req.params;

  req.body = { tour: tourId, user: userId, ...req.body };
  next();
});
