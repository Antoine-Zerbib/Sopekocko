/*
Pour faciliter la gestion de fichiers envoyés avec des requêtes HTTP vers notre API
on utilise un package 'multer'

du coup on va créer un middleware qui va configurer 'multer' pour lui expliquer 
    -comment gérer les fichiers
    -où les enregister
    -quel nom de fichier leur donner
*/

//import de multer
const multer = require('multer'); 

// objet avec les 3 différents mime types possible depuis le frontend
const MIME_TYPES = {
    'images/jpg': 'jpg',
    'images/jpeg': 'jpg',
    'images/png': 'png'
};

//objet de configuration pour multer
const storage = multer.diskStorage({ // diskStorage : fonction de multer pour enregistrer sur le disque

    //besoin de deux éléments: 
    // 1 - fonction qui va retourner et expliquer à multer dans quel dossier enregistrer les fichiers
    destination: (req, file, callback) => { 

         //on appelle le callback tt dessuite avec un 1er argument 'null' pour dire qu'il n'y a pas eu d'erreur s à ce niveau là
        callback(null, 'images') //2e argument nom deu dossier
    },

    // 2 -   élément qui explique à multer quel nom de fichier utiliser
    filename: (req, file, callback) => {

        //on génère le nouveau nom pour le fichier
        const name = file.originalname.split(' ').join('_');

        //l'extension du fichier : MIME TYPE (dictionnaire L.15)
        const extension = MIME_TYPES[file.mimitype]; 

        //création du filename entier
        callback(null, name + Date.now() + '.' + extension); //Date.now (time stamp)=> à la milliseconde près

        //fin de la création d'un nom de fichier suffisament unique pour notre utilisation
    }
})

//exportation du middleware multer configuré
module.exports = multer({ storage }).single('image');