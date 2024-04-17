import { catchAsync } from '../utils/catchAsync';
import Tour from '../models/tourModel';
import AppError from '../utils/appError';
//
// type ViewController = (req: express.Request, res: express.Response) => void;

export const getAccount = catchAsync(async (req, res) => {
  res.status(200).render('account', {
    title: 'My account',
  });
});

export const getOverview = catchAsync(async (req, res) => {
  const tours = await Tour.find();

  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

export const getLogin = catchAsync(async (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account',
  });
});
export const getTour = catchAsync(async (req, res, next) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  if (!tour) {
    return next(new AppError('There is no tour with that name.', 404));
  }

  res.status(200).render('tour', {
    title: `${tour.name} tour`,
    tour: tour,
  });
});
