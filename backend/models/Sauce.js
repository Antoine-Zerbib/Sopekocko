const mongoose = require('mongoose');


//creation du schéma de données pour les sauces
const sauceSchema = mongoose.Schema({
    //Identifiant créé par MongoDB donc pas besoin de l'ajouter
    /*id: { type: String, },*/ 
    userId: { type: String, required: true }, 
    name: { type: String, required: true }, //nom de la sauce
    manufacturer: { type: String, required: true }, //fabricant de la sauce
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number },
    dislikes: { type: Number },
    usersLiked: { type: [String] },
    usersDisliked: { type: [String] }
}); 



module.exports = mongoose.model('Sauce', sauceSchema);