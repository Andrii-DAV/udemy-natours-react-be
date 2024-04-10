import express from 'express';
import {
  createTour,
  deleteTour,
  getTour,
  getAllTours,
  updateTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
} from '../controllers/tourController';
import { protect, restrictTo } from '../controllers/authController';
import reviewRouter from './reviewRoutes';

const tourRouter = express.Router();

tourRouter.route('/monthly-plan/:year').get(getMonthlyPlan);
tourRouter.route('/top-5-cheap-tours').get(aliasTopTours, getAllTours);
tourRouter.route('/tour-stats').get(getTourStats);

tourRouter.route('/').get(protect, getAllTours).post(createTour);
tourRouter
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);

tourRouter.use('/:tourId/reviews', reviewRouter);

export default tourRouter;
