const getMovieById = require("../../api/getMovieById");
const getMovieCredits = require("../../api/getMovieCredits");
const getSimilarMovies = require("../../api/getSimilarMovies");
const getWatchProviders = require("../../api/getWatchProviders");
const Review = require("../../models/reviews");
const session = require("../../session/session");
const getReviews = require("./getReviewsAndRating");

const addReview = async (req, res) => {
  const { rating, body } = req.body;
  console.log(req.body);
  const username = session.username;
  const movie = req.params.id;

  let existingReview;
  try {
    existingReview = await Review.findOne({
      username: username,
      movie: movie,
    }).exec();
  } catch (err) {
    console.log(err);
    const movieData = await getMovieById(req.params.id);
    const cast = await getMovieCredits(req.params.id);
    const watch = await getWatchProviders(req.params.id);
    const reviews = await getReviews(req.params.id);
    const similar = await getSimilarMovies(req.params.id);
    res.render("film", {
      check: session.isLoggedIn,
      username: session.username,
      email: session.email,
      data: movieData,
      cast: cast,
      watchProviders: watch.results.IN,
      reviews: reviews,
      errorReview: "",
      similar: similar,
    });
    return;
  }

  if (existingReview) {
    const id = req.params.id
    const movieData = await getMovieById(id);
    const cast = await getMovieCredits(id);
    const watch = await getWatchProviders(id);
    const reviews = await getReviews(id);
    const similar = await getSimilarMovies(id);
    res.render("film", {
      check: session.isLoggedIn,
      username: session.username,
      email: session.email,
      data: movieData,
      cast: cast,
      watchProviders: watch.results.IN,
      reviews: reviews,
      errorReview: "You have already reviewed this movie!",
      similar: similar,
    });
    return;
  }

  const newReview = new Review({
    movie: movie,
    username: username,
    body: body,
    stars: rating,
  });

  try {
    await newReview.save();
  } catch (err) {
    console.log(err);
    const movieData = await getMovieById(req.params.id);
    const cast = await getMovieCredits(req.params.id);
    const watch = await getWatchProviders(req.params.id);
    const reviews = await getReviews(req.params.id);
    const similar = await getSimilarMovies(req.params.id);
    res.render("film", {
      check: session.isLoggedIn,
      username: session.username,
      email: session.email,
      data: movieData,
      cast: cast,
      watchProviders: watch.results.IN,
      reviews: reviews,
      errorReview: "",
      similar: similar,
    });
    return;
  }

  res.redirect("/film/" + movie);
};

module.exports = addReview;
