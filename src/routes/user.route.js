const userController = require('../controllers/userController');
const auth = require('../middleware/auth.middleware');
const Role = require('../utils/userRole.utils');
const asyncMiddleWare = require('../middleware/asyncHandler.middleware');
const express = require('express');
const router = express.Router();

router.get('/', auth(), asyncMiddleWare(userController.getAllUsers));
router.get('/:id',  auth(), asyncMiddleWare(userController.getUserById));
router.get('/:username',  auth(), asyncMiddleWare(userController.getUserByUsername));
router.get('/whoami',  auth(), asyncMiddleWare(userController.getCurrentUser));
router.post('/',    asyncMiddleWare(userController.createUser));
router.patch('/:id',  auth(Role.Admin), asyncMiddleWare(userController.updateUser));
router.delete('/:id', auth(Role.Admin), asyncMiddleWare(userController.deleteUser));

router.post('/login', asyncMiddleWare(userController.userLogin));

module.exports = router;
