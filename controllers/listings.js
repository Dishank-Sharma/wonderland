const Listing = require('../models/listing.js');

module.exports.index = async (req, res) => {
    const allLinstings = (await Listing.find({})).reverse();
    res.render("listings/index.ejs", { allLinstings });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {

    let { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    };
    listing.reviews.reverse();


    res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;
    if (!req.body.listing) {
        throw ExpressError(400, "Send valid data for listing");
    }
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user;
    newListing.image = { url, filename };
    await newListing.save();
    req.flash("success", "Your listing has been successfully added.");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    };
    let originalImageUrl = listing.image.url
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250")
    res.render("listings/edit.ejs", { listing, originalImageUrl });
}


module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    if (!req.body.listing) {
        throw ExpressError(400, "Send valid data for listing");
    }
    let listing = await Listing.findByIdAndUpdate(id, req.body.listing);
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    req.flash("success", "Listing Updated Successfully!");
    res.redirect(`/listings/${id}`);
};


module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Your listing has been successfully Deleted.");
    res.redirect(`/listings`);
};