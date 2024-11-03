const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/users', userController.createUser);
router.post('/users/:userId/family-members', userController.addFamilyMember);
router.post('/users/:userId/financial-accounts', userController.addFinancialAccount);
router.post('/financial-accounts/:accountId/nominees', userController.addNominee);
router.post('/users/:userId/api-responses', userController.storeApiResponse);

module.exports = router;
