const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsycn.js');
const Review = require('../models/review.js');
const Listing = require('../models/listing.js');
const { validateReview, isloggedin, isReviewAuthor } = require("../middleware.js")

const reviewController = require('../controllers/reviews.js')

// Reviews
// post Route
router.post("/", isloggedin, validateReview, wrapAsync(reviewController.createReview));


// Reviews
// Delete Route
router.delete("/:reviewID", isloggedin, isReviewAuthor, reviewController.destroyReview);

module.exports = router;