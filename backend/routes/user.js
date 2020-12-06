//routeur pour signup et login des utilisateurs
const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user'); 

//création de 2 routes post car le frontend va envoyer des informations : add mail et mdp
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

//export du router
module.exports = router;