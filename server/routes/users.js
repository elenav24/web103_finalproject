import express from 'express'
import UsersController from '../controllers/users.js'

const usersRouter = express.Router();

usersRouter.post('/', UsersController.createUser);
usersRouter.delete('/', UsersController.deleteUser);

export default usersRouter
