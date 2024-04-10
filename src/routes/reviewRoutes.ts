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

reviewRouter
  .route('/')
  .get(getReviews)
  .post(protect, restrictTo('user'), setTourUserIds, createReview);

reviewRouter
  .route('/:id')
  .get(protect, getReview)
  .delete(protect, deleteReview)
  .patch(protect, updateReview);

export default reviewRouter;
