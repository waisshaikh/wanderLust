const express = require('express');
const router= express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync.js');
const { reviewSchema } = require('../schema.js');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middlewares.js');
const reviewConstoller = require ('../controllers/review.js');

// reviwe review route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewConstoller.newReview));


// Delete Review route
router.delete("/:reviewId", isLoggedIn,isReviewAuthor, wrapAsync(reviewConstoller.deleteReview));

module.exports = router;


