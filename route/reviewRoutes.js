const express = require('express');
const reviewController = require('../controllers/reviewController');
const authorController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(authorController.protected);

router
  .route('/')
  .post(
    authorController.protected,
    authorController.restrictTo('user'),
    reviewController.setTourUserId,
    reviewController.createReview
  )
  .get(reviewController.getAllReviews);

router
  .route('/:id')
  .get(reviewController.getReview)
  .delete(
    authorController.restrictTo('user', 'admin'),
    reviewController.deleteReview
  )
  .patch(
    authorController.restrictTo('user', 'admin'),
    reviewController.updateReview
  );

module.exports = router;
