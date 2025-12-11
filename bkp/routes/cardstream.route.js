const router = require('express').Router();
const cardstreamController = require('../controllers/cardstream.controller');
const authMiddleware = require('../middleware/authMiddleware');
const apiAuthMiddleware = require('../middleware/apiAuthMiddleware');

router.put('/purchase', authMiddleware, cardstreamController.purchase);

router.put('/purchase/react-ecommerce', apiAuthMiddleware, cardstreamController.purchase);

router.post('/callback', cardstreamController.callback);

router.post('/mamm/redirect', cardstreamController.mammRedirect);
router.post('/shop/redirect', cardstreamController.shopRedirect);

module.exports = router;
