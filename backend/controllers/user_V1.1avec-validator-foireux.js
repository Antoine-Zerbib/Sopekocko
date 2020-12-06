const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//import des validators
const mailValidator = require('email-validator');
const schema = require('../middleware/password-validator');

const User = require('../models/User');

//enregistrement de nouveaux utilisateurs
exports.signup = (req, res, next) => {

    //test des champs de création e-mail et password
    if (!mailValidator.validate(req.body.email) || (!schema.validate(req.body.password))) {  // We check email && password validity
        throw { error: "Merci de bien vouloir entrer une adresse email et un mot de passe valide !" }
    }
    
        //10 est le Salt, le nombre de hashage pour empécher les 'rainbow table attacks' et résiter aux 'brute-force attacks'
    bcrypt.hash(req.body.password, 10)
        .then(hash => { 
            const user = new User({
                email: req.body.email, //add e-mail du corps de la req
                password: hash //pwd : le cryptage créé par le hash
            })
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !'}))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

//connection des utilisateurs déjà existants
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email }) 
        .then(user => { 
            if(!user){ 
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => { 
                    if (!valid){ 
                        return res.status(401).json({ error: 'Mot de passe incorrect !' }); 
                    }
                    res.status(200).json({
                        userId: user._id, 
                        token: jwt.sign(
                            { userId: user._id }, 
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h'}
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error })); 
};