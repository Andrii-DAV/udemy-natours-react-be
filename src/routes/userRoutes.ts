import express from 'express';
import {
  createUser,
  deleteUser,
  getUser,
  getAllUsers,
  updateUser,
  updateCurrentUser,
  deleteCurrentUser,
} from '../controllers/userController';
import {
  forgotPassword,
  login,
  logout,
  protect,
  resetPassword,
  signup,
  updatePassword,
} from '../controllers/authController';

const userRouter = express.Router();

userRouter.post('/signup', signup);
userRouter.post('/login', login);
userRouter.get('/logout', logout);

userRouter.post('/forgotPassword', forgotPassword);
userRouter.patch('/resetPassword/:token', resetPassword);
userRouter.patch('/updatePassword', protect, updatePassword);

userRouter.route('/updateCurrentUser').patch(protect, updateCurrentUser);
userRouter.route('/deleteCurrentUser').delete(protect, deleteCurrentUser);

userRouter.route('/').get(getAllUsers).post(createUser);
userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

export default userRouter;
