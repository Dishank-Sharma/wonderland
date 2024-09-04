const Review = require('../models/review.js');
const Listing = require('../models/listing.js');


module.exports.createReview = async (req, res) => {
    if (!req.body.review) {
        throw ExpressError(400, "Send valid data for review");
    };
    let listing = await Listing.findById(req.params.id);
    const newReview = new Review(req.body.review);
    newReview.author = req.user;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("alert_success", "New Review Created!");
    res.redirect(`/listings/${req.params.id}`)
};

module.exports.destroyReview = async (req, res) => {
    let { id, reviewID } = req.params;
    await Review.findByIdAndDelete(reviewID);
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewID } });
    req.flash("alert_success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
};