/**
 * This file contains a bunch of helper functions to prevent
 * repetitious code as far as Validation goes
 */

/**
 * Validate a Requet Body - Ensuring that it contains EVERY field from a given array
 * @param {Object} requestBody The request body that you are validating
 * @param {Array} validFields The array of fields that must be included
 * @returns {Boolean} True if the requet body has EVERY field in the validField array, otherwise false
 */

module.exports.BodyEvery = (requestBody, validFields) => {
    return validFields.every(field => Object.keys(requestBody).includes(field))
}



