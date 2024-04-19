import express from 'express';
import {
  getAccount,
  getLogin,
  getMyTours,
  getOverview,
  getTour,
  redirectIfLogged,
} from '../controllers/viewsController';
import { isLoggedIn, protect } from '../controllers/authController';
import { createBookingCheckout } from '../controllers/bookingController';

const viewRouter = express.Router();

viewRouter.get('/me', protect, getAccount);
viewRouter.get('/my-tours', protect, getMyTours);

viewRouter.use(isLoggedIn);

viewRouter.get('/', createBookingCheckout, getOverview);
viewRouter.get('/tours/:slug', getTour);
viewRouter.get('/login', redirectIfLogged, getLogin);

export default viewRouter;
