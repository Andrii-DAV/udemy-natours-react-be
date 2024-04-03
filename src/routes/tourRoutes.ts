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

const tourRouter = express.Router();

// tourRouter.param('id', findTour);

tourRouter.route('/monthly-plan/:year').get(getMonthlyPlan);
tourRouter.route('/top-5-cheap-tours').get(aliasTopTours, getAllTours);
tourRouter.route('/tour-stats').get(getTourStats);
tourRouter.route('/').get(getAllTours).post(createTour);
tourRouter.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

export default tourRouter;
