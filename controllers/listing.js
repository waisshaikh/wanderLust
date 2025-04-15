const Listing = require ('../models/listing');
const mbxgeocoding= require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxgeocoding({ accessToken: mapToken });

// show route
module.exports.index= async (req, res) => {
    const allListings = await Listing.find({});
    res.render('listings/index.ejs', { allListings })
};

//show listing
module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Listing you Requested for does not exist ");
        return res.redirect('/listings');
    }
    console.log(listing);

    res.render('listings/show.ejs', { listing });
};


// create listing
module.exports.createListing = async (req, res, next) => {

    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
    .send();

        let url = req.file.path;
        let fileName = req.filename;
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image={url,fileName};
        newListing.geometry = response.body.features[0].geometry;
       let savedListings = await newListing.save();
       console.log(savedListings);
       
        req.flash('success', "new listing created");
        res.redirect('/listings');
    };


 //Edit route

module.exports.editListing = async (req, res) => {
        let { id } = req.params;
        const listing = await Listing.findById(id);  //listing is local veriable for this function only
        if (!listing) {
            req.flash("error ", "Listing you Requested for does not exist ");
            return res.redirect('/listings');
        }
        let originalImage = listing.image.url;
        originalImage = originalImage.replace('/upload', "/upload/w_250");
        res.render('listings/edit.ejs', { listing, originalImage })
    };
    
    // Update Route

    module.exports.updateListing = async (req, res) => {
            let { id } = req.params;
    
            let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

            if (typeof req.file !=='undefined') {
                let url = req.file.path;
                let filename = req.filename;
                listing.image ={url, filename}
                await listing.save();
                
            }
 
            req.flash('success', "Listing Udpdated ");
            res.redirect(`/listings/${id}`);
        };


        // Delete Route
        module.exports.deleteListing = async (req, res) => {
            let { id } = req.params;
            let deletedListing = await Listing.findByIdAndDelete(id);
            console.log(deletedListing);
            req.flash('success', "Listing Deleted");
            res.redirect('/listings')
    
        }
        