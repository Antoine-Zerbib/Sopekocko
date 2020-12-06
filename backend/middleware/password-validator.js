const passwordValidator = require('password-validator');
const regex = /^[a-zA-Z0-9 _.,!()&]+$/;
const schema= new passwordValidator();

schema
.min(2)
.has(regex)
.has().not().spaces();

module.exports = schema;

