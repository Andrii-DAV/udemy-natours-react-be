import { catchAsync } from '../utils/catchAsync';
import Tour from '../models/tourModel';
import Stripe from 'stripe';
import Booking from '../models/bookingModel';
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from './handlerFactory';

export const createBooking = createOne(Booking);
export const deleteBooking = deleteOne(Booking);
export const updateBooking = updateOne(Booking);
export const getOneBooking = getOne(Booking);
export const getAllBookings = getAll(Booking);

export const getCheckoutSession = catchAsync(async (req, res) => {
  const tour = await Tour.findById(req.params.tourId);
  const stripe = new Stripe(process.env.STRIPE_SK);

  const product = await stripe.products.create({
    name: `${tour.name} Tour`,
    description: tour.summary as string,
  });

  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: Number(tour.price) * 100,
    currency: 'usd',
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/?tour=${
      req.params.tourId
    }&user=${req.user._id}&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        price: price.id,
        quantity: 1,
      },
    ],
    mode: 'payment',
  });

  res.status(200).json({
    status: 'success',
    session,
  });
});

//temp - unsecure
export const createBookingCheckout = catchAsync(async (req, res, next) => {
  const { tour, user, price } = req.query;

  if (!tour && !user && !price) return next();

  await Booking.create({
    tour,
    user,
    price,
  });

  res.redirect(req.originalUrl.split('?')[0]);
});
