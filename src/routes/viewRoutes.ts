import express from 'express';
import {
  getAccount,
  getLogin,
  getOverview,
  getTour,
} from '../controllers/viewsController';
import { isLoggedIn, protect } from '../controllers/authController';

const viewRouter = express.Router();

viewRouter.get('/me', protect, getAccount);

viewRouter.use(isLoggedIn);
viewRouter.get('/', getOverview);
viewRouter.get('/tours/:slug', getTour);
viewRouter.get('/login', getLogin);

export default viewRouter;
