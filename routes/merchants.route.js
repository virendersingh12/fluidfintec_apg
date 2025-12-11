const router = require('express').Router();
const { validate } = require('express-validation');
const { createMerchant } = require('../validations/merchant.validation');
const merchantController = require('../controllers/merchant.controller');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { ROLES } = require('../constants/userRoles');

router.put(
  '/pending/register',
  validate(createMerchant, {}, { allowUnknown: true }),
  merchantController.createMerchant
);
router.post('/createMerchantType', merchantController.createMerchantType);

router.put('/:id/detail', authMiddleware, merchantController.updateMerchantDetail);

router.get('/:id/detail', authMiddleware, merchantController.getMerchantDetail);

router.put('/:id/comment', authMiddleware, merchantController.addComment);

router.post(
  '/:id/approve',
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.SUPER_ADMIN]),
  merchantController.approveMerchant
);

router.post(
  '/:id/section/approve',
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.SUPER_ADMIN]),
  merchantController.approveSection
);

router.post(
  '/:id/section/assessing',
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.SUPER_ADMIN]),
  merchantController.assessingSection
);

router.get(
  '/',
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.SUPER_ADMIN]),
  merchantController.getMerchants
);

//get all sales agent for admin/superadmin
router.get(
  '/salesAgent',
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.SUPER_ADMIN]),
  merchantController.getSalesAgent
);

//get all merchants of sales agent
router.get(
  '/getSAmerchants',
  authMiddleware,
  roleMiddleware([ROLES.SALES_AGENT]),
  merchantController.getSAmerchants
);

router.get(
  '/types',
  authMiddleware,
  merchantController.getMerchantTypes
);

router.get(
  '/statistics',
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.SUPER_ADMIN]),
  merchantController.getStatistics
);


//sales agent merchant's statistics
router.get(
  '/getSAstatistics',
  authMiddleware,
  roleMiddleware([ROLES.SALES_AGENT]),
  merchantController.getSAstatistics
);

router.post(
  '/admins',
  authMiddleware,
  roleMiddleware([ROLES.SUPER_ADMIN]),
  merchantController.createAdmin
);

router.get(
  '/admins',
  authMiddleware,
  roleMiddleware([ROLES.SUPER_ADMIN]),
  merchantController.getAdmins
);

router.delete(
  '/admins/:id',
  authMiddleware,
  roleMiddleware([ROLES.SUPER_ADMIN]),
  merchantController.deleteAdmin
);

router.delete(
  '/merchants/:id',
  authMiddleware,
  merchantController.deleteMerchant
);

router.delete(
  '/deactivateMercahnt/:id',
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.SUPER_ADMIN]),
  merchantController.deactivteMerchant
);

router.post(
  '/activateMercahnt',
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.SUPER_ADMIN]),
  merchantController.activteMerchant
);

router.put(
  '/admins/:id',
  authMiddleware,
  roleMiddleware([ROLES.SUPER_ADMIN]),
  merchantController.updateAdmin,
);

router.put(
  '/:id/update-api-key',
  authMiddleware,
  merchantController.updateAPIKey,
);

router.put(
  '/:id/update-secret-key',
  authMiddleware,
  merchantController.updateSecretKey,
);

module.exports = router;
