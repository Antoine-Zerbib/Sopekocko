//import des packages
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//Pluggin dotenv => .config pour dire qu'on l'utilise, pas besoin de constante
require('dotenv').config();

//Pluggin helmet => sécurise l'app express 
const helmet = require("helmet")

//pluggin apiLimiter => va limiter le nombre de requêtes à la suite
const apiLimiter = require("./middleware/expressRateLimit");
const path = require('path'); 

//import des routes
const sauceRoutes = require('./routes/sauces'); 
const userRoutes = require('./routes/user');

//logique pour se connecter à mongoDB
//pluggin dotenv va chercher l'url mongo dans le fichier '.env'
//(utiliser MONGO_URL_USER ou MONGO_URL_ADMIN)
mongoose.connect(process.env.MONGO_URL_USER,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//création de l'application (vide) qui va appeler la methode express => application express
const app = express();

//appLimiter va empécher de forcer l'app avec des req à répétition, s'applique seulement aux requêtes commençant par /api/
app.use("/api/", apiLimiter);

//helmet va sécuriser les HTTP headers de Express app
app.use(helmet());

// CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next(); 
});

// Body parser
app.use(bodyParser.json());

//ajustement multer pour joindre  les images aux requetes
app.use('/images', express.static(path.join(__dirname, 'images')));

//le début dela route, ! ATTENTION ! il ne faut pas mettre le point ./api/sauces => error
app.use('/api/sauces', sauceRoutes); 
app.use('/api/auth', userRoutes); 

//export de l'application pour y accéder depuis les autres fichiers, notamment le serveur nodes
module.exports = app;



