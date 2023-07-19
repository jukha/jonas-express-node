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
      max: 5,
      // Setter function: Run everytime this value changes
      set: val => Math.round(val * 10) / 10
    },
    createdAt: {
      type: Date,
      default: Date.now()
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
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Avoid duplicate review from same user for a tour via compound indexing
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function(next) {
  // this.populate({ path: 'tour', select: 'name' }).populate({
  //   path: 'user',
  //   select: 'name photo'
  // });
  // ** Turn population of for tours for perfomance optimization.
  this.populate({
    path: 'user',
    select: 'name photo'
  });
  next();
});

// calcAvgRatings is giong to be avaialable on the Review model
reviewSchema.statics.calcAvgRatings = async function(tourId) {
  // 'this' refers to the model (Review) and we can call aggregate on the model
  const stats = await this.aggregate([
    {
      $match: { tour: tourId }
    },
    {
      $group: {
        _id: '$tour',
        noOfRatings: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].noOfRatings,
      ratingsAverage: stats[0].avgRating
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      // If no reviews found for a tour set the default values
      ratingsQuantity: 0,
      ratingsAverage: 4.5
    });
  }
};

reviewSchema.post('save', function() {
  // 'this.constructor' refers to the model that created that document
  this.constructor.calcAvgRatings(this.tour);
});

// Mongoose does not have a direct pre-query middleware for findByIdAndUpdate and findByIdAndDelete and we are using these method for updation and deletion. But they will still invoke this pre save query middleware hook if we use findOneAnd in regex.
reviewSchema.pre(/^findOneAnd/, async function(next) {
  // Since in the query middleware we don't have the direct access to the document. But by executing the query the document gets returned before applying the query. So that way we can access the doc indirectly and  save this in r and later access it in the post query middleware. Reason is that in post the query gets executed and we've the updated data.
  this.r = await this.findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, function() {
  this.r.constructor.calcAvgRatings(this.r.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
