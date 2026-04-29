import express from 'express'
import GiftsController from '../controllers/gifts.js'
import { verifyToken } from '../middleware/auth.js'

const giftsRouter = express.Router();

giftsRouter.use(verifyToken);

giftsRouter.get('/', GiftsController.getGiftIdeas);
giftsRouter.post('/', GiftsController.addGiftIdea);
giftsRouter.put('/:id', GiftsController.updateGiftIdea);
giftsRouter.delete('/:id', GiftsController.deleteGiftIdea);

export default giftsRouter;
