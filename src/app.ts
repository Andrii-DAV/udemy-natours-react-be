import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import userRouter from './routes/userRoutes';
import tourRouter from './routes/tourRoutes';
import reviewRouter from './routes/reviewRoutes';
import AppError from './utils/appError';
import { handleError } from './controllers/errorController';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import cors from 'cors';
import * as path from 'node:path';
import viewRouter from './routes/viewRoutes';
import bookingRouter from './routes/bookingRoutes';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const xss = require('xss-clean');

const app = express();
app.use(
  cors({
    origin: 'http://localhost:5173',
  }),
);

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(`${__dirname}/../`, 'public')));

const scriptSrcUrls = [
  'https://unpkg.com',
  'https://tile.openstreetmap.org',
  'https://js.stripe.com',
];
const styleSrcUrls = [
  'https://unpkg.com/',
  'https://tile.openstreetmap.org',
  'https://fonts.googleapis.com/',
];
const connectSrcUrls = ['https://unpkg.com', 'https://tile.openstreetmap.org'];
const fontSrcUrls = ['fonts.googleapis.com', 'fonts.gstatic.com'];

// Set security HTTP headers
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        "'unsafe-eval'",
        ...scriptSrcUrls,
      ],
      styleSrc: ["'self'", ...styleSrcUrls],
      workerSrc: ["'self'", 'blob:'],
      objectSrc: [],
      imgSrc: ["'self'", 'blob:', 'data:', 'https:'],
      fontSrc: ["'self'", ...fontSrcUrls],
      connectSources: [
        "'self'",
        'ws://localhost:1234',
        'https://api.stripe.com',
      ],
    },
  }),
);

app.use(express.urlencoded({ extended: true, limit: '10kb' }));
dotenv.config({ path: './.env' });

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);
app.use(
  express.json({
    limit: '10kb',
  }),
);

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());
// Data sanitization against XSS
app.use(xss());

//prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
      'ratingsAverage',
      'price',
    ],
  }),
);

app.use(cookieParser());

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.url}`, 404));
});
//Global Error handling middleware
app.use(handleError);

export default app;
