import express from 'express'
import GiftsController from '../controllers/gifts.js'

const giftsRouter = express.Router();

giftsRouter.post('/', GiftsController.addGiftIdea);
giftsRouter.put('/:id', GiftsController.updateGiftIdea);
giftsRouter.delete('/:id', GiftsController.deleteGiftIdea);

export default giftsRouter;
