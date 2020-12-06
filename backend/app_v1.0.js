const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path'); 

const sauceRoutes = require('./routes/sauces'); 
const userRoutes = require('./routes/user');

// Logique pour se connecter à mongoDB
mongoose.connect('mongodb+srv://Antoine:Sn0wb0ard@cluster0.zq6kf.mongodb.net/Cluster0?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

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



