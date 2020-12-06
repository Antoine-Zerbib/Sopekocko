const { json } = require('body-parser');
const Sauce = require('../models/Sauce');
const fs = require('fs'); 

//regex :
const regex = /^[a-zA-Z0-9 _.,!()&]+$/;

exports.createSauce = (req, res, next) => {
    //changement de l'objet req 'thing' pour 'sauce'
    const sauceObject = JSON.parse(req.body.sauce); 
    //identifiant généré par mongoDB supprimé dans le cours, mais demandé pour le schéma des sauces  
    delete sauceObject._id;

    //Si un champ est vide :
    if (!sauceObject.userId || !sauceObject.name ||
        !sauceObject.manufacturer || !sauceObject.description ||
        !sauceObject.mainPepper || !sauceObject.heat ||
        !req.file.path) {
        return res.status(500).json({ error: 'Des champs sont vides, il manque des informations !' });
    }

    //Si les regex ne sont pas bonnes :
    if (!regex.test(sauceObject.name) || !regex.test(sauceObject.manufacturer) ||
        !regex.test(sauceObject.description) || !regex.test(sauceObject.mainPepper) ||
        !regex.test(sauceObject.heat)) {
        return res.status(500).json({ error: 'Des champs contiennent des caractères invalides !' });
        
    }

    //Sinon création d'une nouvelle sauce :
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,

        //création des likes et dislikes
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });

    //code du cours
    /*const thing = new Thing({
        ...thingObject, 
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });*/

    sauce.save() 
        .then(() => res.status(201).json({ message : 'Objet enregistré !'})) 
        .catch(error => res.status(400).json({ error })); 
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
        { 
            ...JSON.parse(req.body.sauce), 
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : {...req.body }; 

        if (!sauceObject.userId || !sauceObject.name ||
            !sauceObject.manufacturer || !sauceObject.description ||
            !sauceObject.mainPepper || !sauceObject.heat ||
            !req.file.path) {
            return res.status(500).json({ error: 'Des champs sont vides, il manque des informations !' });
        }
    
        //Si les regex ne sont pas bonnes :
        if (!regex.test(sauceObject.name) || !regex.test(sauceObject.manufacturer) ||
            !regex.test(sauceObject.description) || !regex.test(sauceObject.mainPepper) ||
            !regex.test(sauceObject.heat)) {
            return res.status(500).json({ error: 'Des champs contiennent des caractères invalides !' });
        }
        
    Sauce.updateOne({ _id: req.params.id}, {  ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet modifié !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id }) 
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1]; 
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id }) 
                    .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
                    .catch(error => res.status(400).json({ error }));
            }); 

        })
        .catch(error => res.status(500).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce)) 
        .catch(error => res.status(404).json({ error })); 
};

exports.getAllSauce = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces)) 
        .catch(error => res.status(400).json({ error }));
};

//likes
/*exports.likeSauce = (req, res, next) => {
    const thingObject = JSON.parse(req.body.sauce.userLikes); 
    const thing = new Thing({
        ...thingObject, 
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    thing.sauces._id.save() 
        .then(() => res.status(201).json({ message : 'Objet enregistré !'})) 
        .catch(error => res.status(400).json({ error })); 
};*/

//Like/Dislike une sauce :
exports.likeSauce = (req, res, next) => {
    // On récupère les informations de la sauce
    Sauce.findOne({ _id: req.params.id })
   .then(sauce => {

       // Selon la valeur recue pour 'like' dans la requête :
       switch (req.body.like) {
           //Si +1 dislike :
           case -1:
               Sauce.updateOne({ _id: req.params.id }, {
                   $inc: {dislikes:1},
                   $push: {usersDisliked: req.body.userId},
                   _id: req.params.id
               })
                   .then(() => res.status(201).json({ message: 'Dislike ajouté !'}))
                   .catch( error => res.status(400).json({ error }))
               break;
           
           //Si -1 Like ou -1 Dislike :
           case 0:
               //Cas -1 Like :
               if (sauce.usersLiked.find(user => user === req.body.userId)) {
                   Sauce.updateOne({ _id : req.params.id }, {
                       $inc: {likes:-1},
                       $pull: {usersLiked: req.body.userId},
                       _id: req.params.id
                   })
                       .then(() => res.status(201).json({message: ' Like retiré !'}))
                       .catch( error => res.status(400).json({ error }))
               }

               //Cas -1 dislike :
               if (sauce.usersDisliked.find(user => user === req.body.userId)) {
                   Sauce.updateOne({ _id : req.params.id }, {
                       $inc: {dislikes:-1},
                       $pull: {usersDisliked: req.body.userId},
                       _id: req.params.id
                   })
                       .then(() => res.status(201).json({message: ' Dislike retiré !'}))
                       .catch( error => res.status(400).json({ error }));
               }
               break;
           
           //Cas +1 Like :
           case 1:
               Sauce.updateOne({ _id: req.params.id }, {
                   $inc: { likes:1},
                   $push: { usersLiked: req.body.userId},
                   _id: req.params.id
               })
                   .then(() => res.status(201).json({ message: 'Like ajouté !'}))
                   .catch( error => res.status(400).json({ error }));
               break;
           default:
               return res.status(500).json({ error });
       }
   })
   .catch(error => res.status(500).json({ error }))
}
