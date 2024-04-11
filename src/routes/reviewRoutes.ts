import express from 'express';
import {
  createReview,
  deleteReview,
  getReview,
  getReviews,
  setTourUserIds,
  updateReview,
} from '../controllers/reviewController';
import { protect, restrictTo } from '../controllers/authController';

const reviewRouter = express.Router({ mergeParams: true });

reviewRouter.use(protect);

reviewRouter
  .route('/')
  .get(getReviews)
  .post(restrictTo('user'), setTourUserIds, createReview);

reviewRouter
  .route('/:id')
  .get(getReview)
  .delete(restrictTo('user', 'admin'), deleteReview)
  .patch(restrictTo('user', 'admin'), updateReview);

export default reviewRouter;
