const express = require('express');
const userController = require('../controllers/userController');
const authcontroller = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authcontroller.signup);
router.post('/login', authcontroller.login);

router.post('/forgetPassword', authcontroller.forgetPassword);
router.patch('/resetPassword/:token', authcontroller.resetPassword);

router.patch(
  '/updatePassword',
  authcontroller.protected,
  authcontroller.updatePassword
);

router.patch('/updateMe', authcontroller.protected, userController.updateMe);
router.delete('/deleteMe', authcontroller.protected, userController.deleteMe);
router.get(
  '/Me',
  authcontroller.protected,
  userController.getMe,
  userController.getUser
);

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
