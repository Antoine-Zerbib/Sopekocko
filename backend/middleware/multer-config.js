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

    // 2 -  deuxieme élément qui explique à multer quel nom de fichier utiliser
        //on ne peut pas se permettre d'utiliser le nom de fichier d'origine, sinon
        //on risquerait d'avoir des pb lorsque 2 fichiers aurait le même nom.
    filename: (req, file, callback) => {

        //ici on génère le nouveau nom pour le fichier
            //partie avant l'extension => nom d'origine du fichier
            //.split(' ') pour faire un tableau du nom en separant les strings autour des espaces
            //.join('_') pour joindre les parties du tableau avec des underscores à la place des espaces
        const name = file.originalname.split(' ').join('_');

        //l'extension du fichier
            // on va utiliser le MIME TYPE du fichier pour générer son extension
            //création du dictionnaire L.15
            //l'extension => élément de notre dictionnaire qui correspond au mimetype du fichier envoyé par le frontend
        const extension = MIME_TYPES[file.mimitype]; 

        //création du filename entier
        callback(null, name + Date.now() + '.' + extension); //Date.now (time stamp)=> à la milliseconde près

        //fin de la création d'un nom de fichier suffisament unique pour notre utilisation
    }
})

//exportation du middleware multer configuré
    //appel de la méthode multer dans laquelle on passe notre objet storage
    //on appelle la méthode single pour dire qu'il s'agit d'un fichier unique et non pas un grp de fichiers
    //et on explique à multer qu'il s'agit de fichier image uniquement
module.exports = multer({ storage }).single('image');