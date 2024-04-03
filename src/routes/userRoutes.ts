import express from 'express';
import {
  createUser,
  deleteUser,
  getUser,
  getAllUsers,
  updateUser,
} from '../controllers/userController';

const userRouter = express.Router();

userRouter.route('/').get(getAllUsers).post(createUser);
userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);
export default userRouter;
