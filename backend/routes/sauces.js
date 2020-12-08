const express = require('express');

//création d'un router
const router = express.Router();

const sauceCtrl = require('../controllers/sauces');

//import de l'authentificateur pour vérifier ll'auth avant de controler
const auth = require('../middleware/auth');

//import multer pour sauvegarder l'image, attention à bien le mettre apres 'auth'
const multer = require('../middleware/multer-config');

//direction, où l'on met le middleware
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.post('/', auth, multer, sauceCtrl.createSauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.get('/', auth, sauceCtrl.getAllSauce);

//création de la route pour les likes
router.post('/:id/like', auth, sauceCtrl.likeSauce);

module.exports = router;