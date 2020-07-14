const express = require('express');
const userController = require('../controllers/userController');
const authcontroller = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authcontroller.signup);
router.post('/login', authcontroller.login);

router.post('/forgetPassword', authcontroller.forgetPassword);
router.patch('/resetPassword/:token', authcontroller.resetPassword);

router.use(authcontroller.protected);
// apply the middleware to all route below this middleware

router.patch('/updatePassword', authcontroller.updatePassword);

router.patch('/updateMe', userController.updateMe);
router.delete('/deleteMe', userController.deleteMe);
router.get('/Me', userController.getMe, userController.getUser);

router.use(authcontroller.restrictTo('admin'));
// apply the middleware to all route below this middleware

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
