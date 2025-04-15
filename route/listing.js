const express = require('express');
const router= express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const { isLoggedIn, isOwner, validateListing } = require('../middlewares.js');
const listingcontroller = require ('../controllers/listing.js');
const multer  = require('multer');
const reviewRouter = require('./review');
router.use('/:id/reviews', reviewRouter); 
const {storage}= require('../cloudConfig.js')
const upload = multer({ storage });



//  listings root

router.route('/')
.get(wrapAsync(listingcontroller.index))
.post(
    upload.single('listing[image]'),
    isLoggedIn,
    wrapAsync(listingcontroller.createListing))  ;



router.route("/new")
.get(isLoggedIn, (req, res) => {

    if (!req.isAuthenticated()) {
        req.flash("error", "You must be loggedin to create listing!")
        return res.redirect('/login');
    }
    res.render('listings/new.ejs')
});

// update route
router.route('/:id')
.get(wrapAsync(listingcontroller.showListing))
.put(
    isLoggedIn,
    isOwner,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingcontroller.updateListing))
    .delete(
        isLoggedIn,
        isOwner,
        wrapAsync(listingcontroller.deleteListing));
    
  
router.route('/:id/edit')
.get(isLoggedIn,
    isOwner,
    wrapAsync(listingcontroller.editListing));

module.exports = router;