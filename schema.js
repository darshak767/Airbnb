const Joi = require("joi");

module.exports.listingSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  image: Joi.string().allow(""),
  price: Joi.number().required().min(0),
  location: Joi.string().required(),
  country: Joi.string().required(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().required().trim().min(3),
  }).required(),
});