import mongoose, { Document, Query } from 'mongoose';
import Tour from './tourModel';

interface IReview {
  review: string;
  rating: number;
  createdAt: Date;
  tour: mongoose.Schema.Types.ObjectId;
  user: mongoose.Schema.Types.ObjectId;
  r?: IReview;
  constructor: {
    calcAverageRatings?: (val: mongoose.Schema.Types.ObjectId) => Promise<void>;
  };
}

type ThisReview = IReview & Query<any, any>;

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review is required'],
    },
    rating: {
      type: Number,
      min: [1, 'Rating must be above 0.1.'],
      max: [5, 'Rating must be below 5.0.'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour.'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (this, next) {
  (this as any).populate({ path: 'user', select: 'name photo' });
  next();
});

reviewSchema.statics.calcAverageRatings = async function (
  tourId: mongoose.Schema.Types.ObjectId,
) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: {
          $avg: '$rating',
        },
      },
    },
  ]);

  await Tour.findByIdAndUpdate(tourId, {
    ratingsQuantity: stats.length > 0 ? stats[0].nRating : 0,
    ratingsAverage: stats.length > 0 ? stats[0].avgRating : 4.5,
  });
};

reviewSchema.post('save', async function () {
  console.log('here? ');
  await (this as any).constructor.calcAverageRatings((this as any).tour);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
  (this as ThisReview).r = await (this as ThisReview).clone().findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, function () {
  (this as ThisReview).r.constructor.calcAverageRatings(
    (this as ThisReview).r.tour,
  );
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;
