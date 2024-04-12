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
  getToursWithin,
  getDistances,
} from '../controllers/tourController';
import { protect, restrictTo } from '../controllers/authController';
import reviewRouter from './reviewRoutes';

const tourRouter = express.Router();

tourRouter
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(getToursWithin);
tourRouter.route('/distance/:latlng/unit/:unit').get(getDistances);

tourRouter
  .route('/monthly-plan/:year')
  .get(protect, restrictTo('admin', 'lead-guide', 'guide'), getMonthlyPlan);
tourRouter.route('/top-5-cheap-tours').get(aliasTopTours, getAllTours);
tourRouter.route('/tour-stats').get(getTourStats);

tourRouter
  .route('/')
  .get(getAllTours)
  .post(protect, restrictTo('admin', 'lead-guide'), createTour);
tourRouter
  .route('/:id')
  .get(getTour)
  .patch(protect, restrictTo('admin', 'lead-guide'), updateTour)
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);

tourRouter.use('/:tourId/reviews', reviewRouter);

export default tourRouter;
