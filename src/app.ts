import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import userRouter from './routes/userRoutes';
import tourRouter from './routes/tourRoutes';
import AppError from './utils/appError';
import { handleError } from './controllers/errorController';

const app = express();
dotenv.config({ path: './.env' });

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/../public`));

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.url}`, 404));
});
//Global Error handling middleware
app.use(handleError);

export default app;
