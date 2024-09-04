const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsycn.js');
const Listing = require('../models/listing.js');
const Review = require('../models/listing.js');
const { isloggedin, isOwner, validateListing } = require('../middleware.js');
const listingController = require('../controllers/listings.js');
const multer = require('multer');
const { storage } = require('../cloudConfig.js');
const upload = multer({ storage });


router.post("/search-Suggestion", async (req, res) => {
    let listings = await Listing.find({});
    res.json(listings);
});


router.get("/search", async (req, res) => {
    let query = req.query.q.toLowerCase();
    if (query.length < 3){
        req.flash("error", "Search field should have more then 'two' characters")
        res.redirect("/listings")
    }
    let results = await Listing.find({});
    let allLinstings = [];
    results.forEach(result => {
        if (result.country.toLowerCase().includes(query)) {
            allLinstings.push(result);
        };
    })
    if (allLinstings.length === 0) {
        req.flash("error", "Sorry, we couldn't find any results")
        res.redirect("/listings")
    }
    res.render("listings/index.ejs", {allLinstings})
});


router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(isloggedin, upload.single('listing[image]'), wrapAsync(listingController.createListing));


//New Route
router.get("/new", isloggedin, listingController.renderNewForm);


router
    .route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isloggedin, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))
    .delete(isloggedin, isOwner, wrapAsync(listingController.destroyListing));


//Edit Route
router.get("/:id/edit", isloggedin, isOwner, wrapAsync(listingController.renderEditForm));


module.exports = router;