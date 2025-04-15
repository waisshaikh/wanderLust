const Listing = require('./models/listing');
const Review = require('./models/review.js');
const expressError = require('./utils/expressError.js');
const {listingSchema,reviewSchema}= require('./schema.js');

module.exports.isLoggedIn =( req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must be loggedin to create listing!")
        return res.redirect('/login');
    }
    next();

};

module.exports.saveRedirectUrl = (req,res,next)=>{
    if (req.session.redirectUrl) {
        res.locals.redirectUrl=req.session.redirectUrl;  
    }
    next();
}   

module.exports.isOwner= async(req,res,next)=>{
    let { id } = req.params;
    let listing= await Listing.findById(id);
    if(! listing.owner.equals(res.locals.currUser._id))  {
        req.flash('error', "Your not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validateListing = (req, res, next) => {
    const validationResult = listingSchema.validate(req.body);

    if (validationResult.error) {
        let errMsg = validationResult.error.details.map((el) => el.message).join(",");
        throw new expressError(400, errMsg);
    } else {
        next();
    }
};

module.exports.validateReview= (req, res, next) => {
    const validationResult = reviewSchema.validate(req.body);

    if (validationResult.error) {
        let errMsg = validationResult.error.details.map((el) => el.message).join(",");
        throw new expressError(400, errMsg);
    } else {
        next();
    }
};

module.exports.isReviewAuthor= async(req,res,next)=>{
    let { id,reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if(! review.author.equals(res.locals.currUser._id))  {
        req.flash('error', "Your not the Author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

