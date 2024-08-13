// controlers/reviewController.js
const Review = require('../models/Review');
const Adventure = require('../models/Adventure');

const createReview = async (req, res) => {
  const { adventureId, rating, comment } = req.body;

  try {
    const adventure = await Adventure.findById(adventureId);

    if (!adventure) {
      return res.status(404).json({ message: 'Adventure not found' });
    }

    const alreadyReviewed = await Review.findOne({ user: req.user.id, adventure: adventureId });

    if (alreadyReviewed) {
      return res.status(400).json({ message: 'You have already reviewed this adventure' });
    }

    const review = new Review({
      user: req.user.id,
      adventure: adventureId,
      rating,
      comment,
    });

    await review.save();

    adventure.reviews.push(review._id);
    await adventure.save();

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getReviewsByAdventure = async (req, res) => {
  try {
    const reviews = await Review.find({ adventure: req.params.adventureId }).populate('user', 'name');

    if (!reviews) {
      return res.status(404).json({ message: 'No reviews found' });
    }

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createReview, getReviewsByAdventure };
