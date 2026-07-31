//cloudinary
const cloudinary = require("cloudinary").v2;

//mapbox Section
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

//utils section

const { getAvgRating, getStarBreakdown } = require("../utils/review.js");
const { expandQuery } = require("../utils/searchSynonyms.js");

//mongodb Section
const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
  const { q, category, minPrice, maxPrice, facilities, sortBy } = req.query;
  let filter = {};
  let sort = {};

  // Enhanced search logic with synonym expansion
  if (q && q.trim()) {
    const searchTerm = expandQuery(q.trim());
    const words = searchTerm.split(/\s+/).filter((word) => word.length > 0);

    // Create flexible search patterns
    const searchConditions = [];

    // For each word, create partial match conditions
    words.forEach((word) => {
      const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const wordRegex = new RegExp(escapedWord, "i");

      searchConditions.push(
        { title: wordRegex },
        { description: wordRegex },
        { location: wordRegex },
        { country: wordRegex },
        { facilities: { $in: [wordRegex] } }
      );
    });

    // Exact phrase matching (higher priority)
    const exactRegex = new RegExp(
      searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      "i"
    );
    const exactConditions = [
      { title: exactRegex },
      { description: exactRegex },
      { location: exactRegex },
      { country: exactRegex },
    ];

    filter.$or = [...exactConditions, ...searchConditions];
  }

  // Category filtering
  if (category && category !== "all") {
    filter.category = category;
  }

  // Price range filtering
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = parseInt(minPrice);
    if (maxPrice) filter.price.$lte = parseInt(maxPrice);
  }

  // Facilities filtering
  if (facilities) {
    const facilityArray = Array.isArray(facilities) ? facilities : [facilities];
    filter.facilities = { $all: facilityArray };
  }

  // Sorting logic
  switch (sortBy) {
    case "price_low":
      sort.price = 1;
      break;
    case "price_high":
      sort.price = -1;
      break;
    case "rating":
      // We'll handle this after population
      break;
    case "newest":
      sort._id = -1;
      break;
    default:
      // Default sorting by relevance (if search query) or newest
      if (q) {
        // For search queries, we'll handle relevance scoring later
      } else {
        sort._id = -1;
      }
  }

  const allListings = await Listing.find(filter).populate("reviews").sort(sort).lean();
  // Calculate average ratings and relevance scores
  allListings.forEach((listing) => {
    listing.avgRating = getAvgRating(listing.reviews);

    // Calculate search relevance score if there's a query
    if (q && q.trim()) {
      listing.relevanceScore = calculateRelevanceScore(listing, q.trim());
    }
  });

  // Sort by rating if requested (needs to be done after rating calculation)
  if (sortBy === "rating") {
    allListings.sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0));
  } else if (q && q.trim() && !sortBy) {
    // Sort by relevance for search queries
    allListings.sort(
      (a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0)
    );
  }



  return res.status(200).json({
    success: true,
    data: {
      listings: allListings,
      totalResults: allListings.length,
    },
  });
};

// Helper function to calculate search relevance score
function calculateRelevanceScore(listing, query) {
  let score = 0;
  const queryLower = query.toLowerCase();
  const words = queryLower.split(/\s+/);

  // Title matches (highest priority)
  if (listing.title && listing.title.toLowerCase().includes(queryLower)) {
    score += 10;
  }
  words.forEach((word) => {
    if (listing.title && listing.title.toLowerCase().includes(word)) {
      score += 5;
    }
  });

  // Location matches (high priority)
  if (listing.location && listing.location.toLowerCase().includes(queryLower)) {
    score += 8;
  }
  words.forEach((word) => {
    if (listing.location && listing.location.toLowerCase().includes(word)) {
      score += 4;
    }
  });

  // Country matches
  if (listing.country && listing.country.toLowerCase().includes(queryLower)) {
    score += 6;
  }

  // Description matches
  if (
    listing.description &&
    listing.description.toLowerCase().includes(queryLower)
  ) {
    score += 3;
  }
  words.forEach((word) => {
    if (
      listing.description &&
      listing.description.toLowerCase().includes(word)
    ) {
      score += 1;
    }
  });

  // Facilities matches
  if (listing.facilities && listing.facilities.length > 0) {
    listing.facilities.forEach((facility) => {
      if (facility.toLowerCase().includes(queryLower)) {
        score += 2;
      }
      words.forEach((word) => {
        if (facility.toLowerCase().includes(word)) {
          score += 1;
        }
      });
    });
  }

  // Boost score based on rating (quality factor)
  if (listing.avgRating) {
    score += listing.avgRating * 0.5;
  }

  return score;
}

module.exports.renderNewForm = (req, res) => {
  res.render("./listings/new.ejs", { facilitiesList });
};

module.exports.showListings = async (req, res) => {
  const id = req.params.id;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");

  if (!listing) {
    return res.status(404).json({
      success: false,
      message: "The Listing you requested for doesn't exist!",
    });
  }

  return res.status(200).json({
    success: true,
    listing,
  });
};

module.exports.createListing = async (req, res) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();
  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  newListing.geometry = response.body.features[0].geometry;
  await newListing.save();
  req.flash("success", "New Hotel Added!");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  const id = req.params.id;
  const listing = await Listing.findById(id);
  if (!listing) {
    return res.status(404).json({
      success: false,
      message: "The Listing you requested for does not exist!",
    });
  }
  let originalImageUrl = listing.image?.url;
  if (originalImageUrl) {
    originalImageUrl = originalImageUrl.replace(
      "/upload",
      "/upload/w_250,f_auto,q_auto"
    );
  }
  return res.status(200).json({
    success: true,
    listing,
    originalImageUrl,
  });
};

module.exports.updateListing = async (req, res) => {
  const id = req.params.id;
  let listing = await Listing.findById(id);

  if (!listing) {
    return res.status(404).json({
      success: false,
      message: "Listing not found!",
    });
  }

  // Handle facilities parsing if passed as array or single value
  if (req.body.listing) {
    if (typeof req.body.listing.facilities === "string") {
      req.body.listing.facilities = [req.body.listing.facilities];
    }
    Object.assign(listing, req.body.listing);
  }

  // Update geocoding if location is provided
  if (req.body.listing?.location) {
    let response = await geocodingClient
      .forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
      .send();
    if (response.body.features && response.body.features.length > 0) {
      listing.geometry = response.body.features[0].geometry;
    }
  }

  // Update image if new file uploaded
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
  }

  await listing.save();

  return res.status(200).json({
    success: true,
    message: "Updated Successfully!",
    listing,
  });
};

module.exports.destroyListing = async (req, res) => {
  const id = req.params.id;
  const listing = await Listing.findById(id);

  if (!listing) {
    return res.status(404).json({
      success: false,
      message: "Listing not found!",
    });
  }

  if (listing.image && listing.image.filename) {
    await cloudinary.uploader.destroy(listing.image.filename);
  }
  await Listing.findByIdAndDelete(id);

  return res.status(200).json({
    success: true,
    message: "Deleted Successfully!",
  });
};
