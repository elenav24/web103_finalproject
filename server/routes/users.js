import express from 'express'
import UsersController from '../controllers/users.js'
import { verifyToken } from '../middleware/auth.js'

const usersRouter = express.Router();

usersRouter.use(verifyToken);

usersRouter.post('/', UsersController.createUser);
usersRouter.delete('/', UsersController.deleteUser);

export default usersRouter;
