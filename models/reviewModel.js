const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty']
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour.']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user.']
    }
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

reviewSchema.statics.calcRatingAverage = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId }
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingAverage: stats[0].avgRating,
      ratingQuantity: stats[0].nRating
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingAverage: 4.5,
      ratingQuantity: 0
    });
  }
};

reviewSchema.post('save', function () {
  this.constructor.calcRatingAverage(this.tour);
});

reviewSchema.post(/findOneAnd/, async function () {
  const review = await this.findOne();
  review.constructor.calcRatingAverage(review.tour);
});

reviewSchema.pre(/^find/, function (next) {
  // this.populate({
  //   path: 'tour',
  //   select: 'name',
  // });
  // this.populate({ path: 'user', select: 'name photo' });

  // this.populate({
  //   path: 'tour',
  //   select: 'name',
  // });
  this.populate({ path: 'user', select: 'name photo' });

  next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
