//Ce fichier est le controller, qui va stocker toute la logique métier (de chaque fonctions)
const { json } = require('body-parser');
const Sauce = require('../models/Sauce');

//import du package fs de nodes
const fs = require('fs'); //donne accès aux différentes opérations liées au système de fichier


/* --  CREATE  -- */

//on exporte 'createThing' pour la création d'un objet
exports.createSauce = (req, res, next) => {
    //changement de l'objet req 'thing' pour 'sauce'
    const sauceObject = JSON.parse(req.body.sauce); 
    //identifiant généré par mongoDB supprimé dans le cours, mais demandé pour le schéma des sauces  
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,

        //on rajoute une étape car le frontend ne sais pas quel est l'Url de l'image maintenant
        //car c'est notre middleware multer qui a généré ce fichier
        /* imageUrl: req.file.filename //qui donne le nom du fichier mais pas l'url */
            //`${req.protocol}` => HTTP ou HTTPS
            //://${req.get('host') => pour avoir le host de notre server
                //pour l'instant c'est localhost:3000, mais au déploiement ce sera la racine du server
        //protocole, nom d'hôte / images / nom du fichier
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,

        //création des likes et dislikes
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });

    sauce.save() 
        .then(() => res.status(201).json({ message : 'Objet enregistré !'})) 
        .catch(error => res.status(400).json({ error })); 
};

/* --  MODIFY  -- */

exports.modifySauce = (req, res, next) => {

    //test pour savoir dans quel cas de figure on se trouve
        // => modif avec (req.file) ou sans (pas de req.file) changement d'image
    const sauceObject = req.file ?// '?' opérateur ternaire => savoir si il existe
    // deux objets en réponse : {si il existe} : {si il existe pas}
        //si il n'existe pas on fait comme avant pour notre route Post
        //si il existe, on le prend en compte
    { //on fait comme dans la route POST
        ...JSON.parse(req.body.sauce),  //recupérer les infos sur l'objet dans cette partie de la requête

        //et on génère l'imageUrl
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body };
    
        //ici plutot que req.body => sauceObject L.43
    Sauce.updateOne({ _id: req.params.id}, { /*...req.body,*/  ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet modifié !' }))
        .catch(error => res.status(400).json({ error }));
};


/* --  DELETE  -- */

//on va faire en sorte que lorsque un utilisateur supprime son objet, 
//que l'image qui correspond à cet objet soit également supprimé de notre server 
    //pour accéder aux fichier, on va faire une importation de 'fs' (file system) L.6
exports.deleteSauce = (req, res, next) => {

     //avant de supprimer l'objet de la base, on va aller le chercher pour avoir l'URL de l'image
    // => accès au nom du fichier et donc pouvoir de supprimer
        //on veut trouver celui qui a l'_id qui correspond à celui dans les paramètres de la requête
    Sauce.findOne({ _id: req.params.id }) 

        //dans le callback on récupère une 'sauce'
        //avec laquelle on veut récupérer non pas l'url, mais le nom précis du fichier
        .then(sauce => {

            //pour extraire le fichier => const filename
            //on récupère l'image url du thing retourné par la base
            //on split autour de '/images/'
            // => tableau de 2 éléments, avant et apres le '/images/'
            // on récupère le 2e élément, donc le nom du fichier
            const filename = sauce.imageUrl.split('/images/')[1]; 

            //avec ce nom de ficchier, on va appeler une fonction du package 'fs'
            //unlink sert a supprimer un fichier
            //1er argument : string du chemin de ce fichier
            //2e argument le callback => que faire une fois le ffichier supprimé
            fs.unlink(`images/${filename}`, () => {

                  // une fois supprimé on veut enlever le 'Thing de la base de données
                Sauce.deleteOne({ _id: req.params.id }) 
                    .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
                    .catch(error => res.status(400).json({ error }));
            }); 
        })
        .catch(error => res.status(500).json({ error }));  //500 erreur server
};


/* --  READ  -- */

// recupérer les infos d'une sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce)) 
        .catch(error => res.status(404).json({ error })); 
};

//récupérer toutes les sauces
exports.getAllSauce = (req, res, next) => {
    Sauce.find()// sans arguments pour récupérer la liste complète dans un promise
        .then(sauces => res.status(200).json(sauces)) 
        .catch(error => res.status(400).json({ error }));
};


/* --  LIKES  -- */

//Like/Dislike une sauce :
exports.likeSauce = (req, res, next) => {

    

        // Selon la valeur recue pour 'like' dans la requête :
            //
        switch (req.body.like) {

           //Si +1 dislike :
            case -1:
                Sauce.updateOne({ _id: req.params.id }, {

                    //opérateur mongoDB qui permet d'incrémenter en + ou - un champ spécifique
                    $inc: {dislikes:1}, 

                     //enregistrer l'Id de l'utilisateur qui like/dislike la sauce
                    $push: {usersDisliked: req.body.userId},
                    _id: req.params.id
                })
                    .then(() => res.status(201).json({ message: 'Dislike ajouté !'}))
                    .catch( error => res.status(400).json({ error }))
                break;
            
            //Si -1 Like ou -1 Dislike :
            case 0:
                // On récupère les informations de la sauce
                Sauce.findOne({ _id: req.params.id })
                .then(sauce => {

                    //Cas -1 Like :
                    if (sauce.usersLiked.find(user => user === req.body.userId)) {
                        Sauce.updateOne({ _id : req.params.id }, {
                            $inc: {likes:-1},
                            
                            //supprime l'Id de l'utilisateur
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
                })
                    .catch(error => res.status(500).json({ error }))
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
   
}
