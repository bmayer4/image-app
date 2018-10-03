const validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validatePostInput(data) {
    let errors = {};
    
    data.description = !isEmpty(data.description) ? data.description : '';
    data.category = !isEmpty(data.category) ? data.category : '';

    if (!validator.isLength(data.description, { max: 80 })) {
        errors.description = 'Description can not be more than 80 characters';
    }

    if (validator.isEmpty(data.description)) {
        errors.description = 'Description field is required';
    }

    if (validator.isEmpty(data.category)) {
        errors.category = 'Category field is required';
    }

    return {
        errors, 
        isValid: isEmpty(errors)
    }
}