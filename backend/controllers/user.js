//package de cryptage pour les mots de passe
const bcrypt = require('bcrypt');

//package qui permet de creer des tokens et les vérifier
const jwt = require('jsonwebtoken');

//import des validators
const mailValidator = require('email-validator');
const schema = require('../middleware/password-validator'); 

//on va enregistrer et lire des users dans ce middleware, donc besoin du modèle User
const User = require('../models/User');


/* -- SIGNUP -- */

exports.signup = (req, res, next) => {

    if (!mailValidator.validate(req.body.email) || (!schema.validate(req.body.password))) { 
        throw { error: "Merci de bien vouloir entrer une adresse email et un mot de passe valide !" }
    }

    //10 est le Salt, nb de hashages du mdp pour empécher les 'rainbow table attacks' et résiter aux 'brute-force attacks'
    bcrypt.hash(req.body.password, 10)
        .then(hash => { // recupération du hash de mdp
            const user = new User({
                email: req.body.email, //add e-mail du corps de la req
                password: hash //pwd : le cryptage créé par le hash
            })
            user.save() //enregistrement dans la BD
                .then(() => res.status(201).json({ message: 'Utilisateur créé !'}))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};


/* -- LOGIN -- */

exports.login = (req, res, next) => {

    //trouver User dans la base de données (adresse e-mail rentrée par l'utilisateur)
    User.findOne({ email: req.body.email })   
        .then(user => { 

            //si on a pas trouvé de user
            if(!user){ 
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }

            //utilisation de bcrypt pour comparer les mdp
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {  
                    
                    // si c'est faux, error
                    if (!valid){  
                        return res.status(401).json({ error: 'Mot de passe incorrect !' }); 
                    }

                    //si c'est vrai, renvoyer un user id et un token 
                    res.status(200).json({
                        userId: user._id, 

                        //utilisation de jwt => permet de creer des tokens et les vérifier
                        /*'TOKEN'*/ //au lieu d'une simple chaine de caractères, on va appeler une fonction 
                        token: jwt.sign( 

                            //les données que l'on veut encoder dans le token (payLoad)
                            { userId: user._id }, 

                            // clef secrète pour le codage créée par jwt caché en gitignore dans '.env'
                            'env.TOKEN_USER',

                            //argument de configuration
                            { expiresIn: '24h'}
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error })); 
};