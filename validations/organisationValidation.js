const Joi = require('joi');

const createOrganisationSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().optional(),
});

module.exports = { createOrganisationSchema };
