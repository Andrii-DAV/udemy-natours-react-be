import express from 'express';
import {
  deleteUser,
  getUser,
  getAllUsers,
  updateUser,
  updateCurrentUser,
  deleteCurrentUser,
  getCurrentUser,
  setCurrentUserId,
  uploadUserPhoto,
  resizeUserPhoto,
} from '../controllers/userController';
import {
  forgotPassword,
  login,
  logout,
  protect,
  resetPassword,
  restrictTo,
  signup,
  updatePassword,
} from '../controllers/authController';

const userRouter = express.Router();

userRouter.post('/signup', signup);
userRouter.post('/login', login);
userRouter.get('/logout', logout);
userRouter.post('/forgotPassword', forgotPassword);
userRouter.patch('/resetPassword/:token', resetPassword);

userRouter.use(protect);

userRouter.patch('/updatePassword', updatePassword);
userRouter.get('/profile', setCurrentUserId, getCurrentUser);
userRouter
  .route('/updateCurrentUser')
  .patch(uploadUserPhoto, resizeUserPhoto, updateCurrentUser);
userRouter.route('/deleteCurrentUser').delete(deleteCurrentUser);

userRouter.use(restrictTo('admin'));

userRouter.route('/').get(getAllUsers);
userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

export default userRouter;
