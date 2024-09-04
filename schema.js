const Joi = require('joi');
const { joiPasswordExtendCore } = require('joi-password');
const joiPassword = Joi.extend(joiPasswordExtendCore);
const { model } = require('mongoose');


module.exports.listingSchema = Joi.object({
    listing : Joi.object({
        title : Joi.string().required(),
        description : Joi.string().required(),
        location : Joi.string().required(),
        country : Joi.string().required(),
        price : Joi.number().required().min(0),
        image : Joi.string().allow("", null),
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review : Joi.object({
        rating : Joi.number().required().min(1).max(5),
        comment : Joi.string().required(),
    }).required()
});


module.exports.userSchema = Joi.object({
    
    username: Joi.string().min(3).max(50).required(),
        email: Joi.string().min(3).max(30),
                  password: joiPassword
                        .string()
                        .minOfSpecialCharacters(1)
                        .minOfLowercase(1)
                        .minOfUppercase(1)
                        .minOfNumeric(1)
                        .noWhiteSpaces()
                        .onlyLatinCharacters()
                        .required(),
});
