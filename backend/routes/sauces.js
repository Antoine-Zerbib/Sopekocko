const express = require('express');
const router = express.Router();

const sauceCtrl = require('../controllers/sauces');
const auth = require('../middleware/auth');

const multer = require('../middleware/multer-config');

//changement des routes stuff (du cours) => sauces
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.post('/', auth, multer, sauceCtrl.createSauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.get('/', auth, sauceCtrl.getAllSauce);

//création de la route pour les likes
router.post('/:id/like', auth, sauceCtrl.likeSauce);

module.exports = router;