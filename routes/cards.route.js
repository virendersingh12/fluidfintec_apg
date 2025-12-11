const router = require('express').Router();
const cardController = require('../controllers/card.controller');

router.put('/buy', cardController.buy);

module.exports = router;
