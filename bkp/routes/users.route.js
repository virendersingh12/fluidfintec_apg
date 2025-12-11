const router = require('express').Router();
const { validate } = require('express-validation');
const { newPayee } = require('../validations/payee.validation');
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { ROLES } = require('../constants/userRoles');

router.put(
    '/new/payee',authMiddleware,
    validate(newPayee, {}, {allowUnknown: true}),userController.createPayee
);

router.get(
    '/payee',authMiddleware,userController.userPayee
);
module.exports = router;
