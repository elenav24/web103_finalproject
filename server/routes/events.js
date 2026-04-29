import express from 'express'
import EventsController from '../controllers/events.js'
import { verifyToken } from '../middleware/auth.js'

const eventsRouter = express.Router();

eventsRouter.use(verifyToken);

eventsRouter.get('/', EventsController.getEvents);
eventsRouter.post('/', EventsController.createEvent);
eventsRouter.get('/:id', EventsController.getEventById);
eventsRouter.patch('/:id', EventsController.updateEvent);
eventsRouter.delete('/:id', EventsController.deleteEvent);

export default eventsRouter;
