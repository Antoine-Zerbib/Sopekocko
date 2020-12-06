const mongoose = require('mongoose');

//'mongoose-unique-validator' permet de ne pas avoir deux utilisateurs avec le même e-mail
const uniqueValidator = require('mongoose-unique-validator');

//modèle mongoose du User pour login
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true}, //unique = true pour éviter plusieures adresses email identiques
    password: { type: String, required: true}
});

//on passe uniqueValidator comme argument à cette méthode
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
