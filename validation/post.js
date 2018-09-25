const validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validatePostInput(data, fileData) {
    let errors = {};

;   data.description = !isEmpty(data.description) ? data.description : '';
    data.category = !isEmpty(data.category) ? data.category : '';

    if (fileData && fileData.filename) {
        fileData.filename = !isEmpty(fileData.filename) ?  fileData.filename : '';
    } else if (data.image) {
        data.image = !isEmpty( data.image) ?  data.image : '';
    }

    if (!validator.isLength(data.description, { max: 80 })) {
        errors.description = 'Description can not be more than 80 characters';
    }

    if (validator.isEmpty(data.description)) {
        errors.description = 'Description field is required';
    }

    if (validator.isEmpty(data.category)) {
        errors.category = 'Category field is required';
    }

    if (fileData && fileData.filename && validator.isEmpty(fileData.filename)) {  
        errors.image = 'Image is required';
    } 

    if (data.image && validator.isEmpty(data.image)) {  
        errors.image = 'Image is required';
    }

    return {
        errors, 
        isValid: isEmpty(errors)
    }
}