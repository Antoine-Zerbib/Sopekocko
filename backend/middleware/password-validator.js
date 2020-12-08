//package pour vérifier le mot de passe
const passwordValidator = require('password-validator');
const regex = /^[a-zA-Z0-9 _.,!()&]+$/; //caractères autorisés
const schema= new passwordValidator();

schema
.min(3) //3 letres minimum
.has(regex)
.has().not().spaces(); //pas d'espaces dans le mdp

module.exports = schema;

