import mongoose from 'mongoose';
import slugify from 'slugify';

export interface ITour {
  name: string;
  slug?: string;
  ratingsAverage?: number;
  ratingsQuantity?: number;
  price: number;
  duration: number;
  maxGroupSize: number;
  priceDiscount?: number;
  summary: string;
  description: string;
  imageCover: string;
  images?: string[];
  durationWeeks?: number;
  startDates?: string[];
  createdAt: string;
  secretTour: boolean;

  start?: string;
}
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name.'],
      unique: true,
      trim: true,
      maxLength: [
        40,
        'A tour name must have less or equal then 40 characters.',
      ],
      minLength: [
        10,
        'A tour name must have more or equal then 10 characters.',
      ],
    },
    slug: String,
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 0.1.'],
      max: [5, 'Rating must be below 5.0.'],
      set: (val: number) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: { type: Number, default: 0 },
    price: { type: Number, required: [true, 'A tour must have a price.'] },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration.'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size.'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty.'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult.',
      },
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val: number) {
          //When creating only/ doesn't work with updating
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price.',
      },
    },
    summary: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'A tour must have a description.'],
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image.'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      //GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

//DOCUMENT MIDDLEWARE: runs before .save() and .create()
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
//Embedding
// tourSchema.pre('save', async function (next) {
//   const guidesPromises = this.guides.map(
//     async ({ id }) => await User.findById(id),
//   );
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });
//Query middleware
tourSchema.pre(/^find/, function (next) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });
  next();
});
tourSchema.pre('find', function (next) {
  this?.find({ secretTour: { $ne: true } });
  // this.start = Date.now();
  next();
});
// tourSchema.post(/^find/, function (docs, next) {
//   if (this?.start) console.log('query took (in ms): ', Date.now() - this.start);
//   next();
// });

// tourSchema.pre('aggregate', function (next) {
//   this.pipeline().unshift({
//     $match: { secretTour: { $ne: true } },
//   });
//   next();
// });
tourSchema.post('save', function (doc, next) {
  next();
});

//Virtual populate
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

const Tour = mongoose.model('Tour', tourSchema);
export default Tour;
