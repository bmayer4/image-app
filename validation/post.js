const validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validatePostInput(data) {
    let errors = {};

    data.text = !isEmpty(data.description) ? data.description : '';
    data.category = !isEmpty(data.category) ? data.category : '';
    data.imagePath = !isEmpty(data.imagePath) ? data.imagePath : '';

    if (validator.isEmpty(data.description)) {
        errors.description = 'Description field is required';
    }

    if (validator.isEmpty(data.category)) {
        errors.category = 'Category field is required';
    }

    if (validator.isEmpty(data.imagePath)) {
        errors.imagePath = 'image is required';
    }

    return {
        errors, 
        isValid: isEmpty(errors)
    }
}