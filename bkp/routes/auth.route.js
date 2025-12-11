const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/authMiddleware');


router.get('/', authMiddleware, authController.getUser);

router.put('/login/email', authController.loginEmail);

router.post('/token', authController.getToken);

router.post('/activate-account', authController.activateAccount);

router.post('/resend-activation-email', authController.resendActivationEmail);

router.post('/request-password-reset', authController.requestPasswordReset);

router.post('/password-reset', authController.resetPassword);

module.exports = router;
