const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//Pluggin dotenv => .config pour dire qu'on l'utilise, pas besoin de constante
require('dotenv').config();

//Pluggin helmet => sécurise l'app express 
const helmet = require("helmet")
const path = require('path'); 

const sauceRoutes = require('./routes/sauces'); 
const userRoutes = require('./routes/user');

//Logique pour se connecter à mongoDB
//pluggin dotenv va chercher l'url mongo dans le fichier '.env'
//Utiliser MONGO_URL_USER ou MONGO_URL_ADMIN
mongoose.connect(process.env.MONGO_URL_USER,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

//helmet va sércuriser les HTTP headers de Express app
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

app.use('/images', express.static(path.join(__dirname, 'images')));

//changement de la route 'stuff' du cours par 'sauces'
app.use('/api/sauces', sauceRoutes); 
app.use('/api/auth', userRoutes); 

module.exports = app;



