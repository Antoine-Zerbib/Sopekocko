//Middleware pour vérifier le token envoyé par l'application frontend avec sa req, correspond bien avec celui encodé dans le token db
const jwt = require('jsonwebtoken'); //package pour vérifier les tokens

module.exports = (req, res, next) => { 
    try {
        //récupérer le token dans le header autorisation
        const token = req.headers.authorization.split(' ')[1]; 

        //verifie le token avec la clef secrète qui doit correspondre à celle dans la fonction login
        const decodedToken = jwt.verify(token, 'env.TOKEN_USER'); 

        // extraction l'objet js dans le token : userId
        const userId = decodedToken.userId;

        //si il y a un userId avec la req, on vérifie qu'elle correspond bien à celle du token 
        if (req.body.userId && req.body.userId !== userId) {
            throw 'User ID non valable !'; //throw renvoyer à catch
        } else { 
            next();
        };


    } catch (error) {
        //si on recoit une erreur, on veut l'envoyer
        res.status(401).json({ error: error | /* sinon */ 'Requête non authentifiée !' }) //401 pb authentification
    }
};