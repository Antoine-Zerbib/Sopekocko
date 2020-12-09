//Middleware qui vérifie le token envoyé par l'application frontend avec sa req
//vérifier qu'il s'agit d'un token valable
//si userId envoyé avec la req, qu'il corresponde bien avec celui encodé dans le token

const jwt = require('jsonwebtoken'); //besoin du package pour vérifier les tokens

module.exports = (req, res, next) => { //export d'un middleware classique
    try { //on utilise try/catch car plusieurs éléments peuvent poser problème

        //récupérer le token dans le header autorisation
            //split autour de l'espace crée un tableau avec bearer [0] et le token [1] (donc après 'bearer ')
        const token = req.headers.authorization.split(' ')[1]; 

        //décoder le token avec le package
        //verifie le token avec la clef secrète qui doit correspondre à celle dans la fonction login
        const decodedToken = jwt.verify(token, 'env.TOKEN_USER'); 
        //si la vérif échoue => catch

        //on va extraire l'objet js dans le token : userId
        const userId = decodedToken.userId;

        //si il y a un userId avec la req, on vérifie qu'elle correspond bien à celle du token 
        if (req.body.userId && req.body.userId !== userId) {
            //dans ce cas on ne veux pas authentifier la requête et retourner une erreur
            throw 'User ID non valable !'; //throw pour renvoyer l'erreur à catch
        } else { //si tout va bien => next
            next();
            //car nous sommes sur un middleware appliqué avant les controleurs de nos routes
            //donc chaque requête sur une route protégée va d'abord passer par ce middleware
            //et à ce stade tout va bien donc on peut passer la requête au prochain middleware.
        };


    } catch (error) {
        //si on recoit une erreur, on veut l'envoyer
        res.status(401).json({ error: error | /* sinon */ 'Requête non authentifiée !' }) //401 pb authentification
    }
};