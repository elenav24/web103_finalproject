import express from 'express'
import EventsController from '../controllers/events.js'

const eventsRouter = express.Router();

eventsRouter.get('/', EventsController.getEvents);
eventsRouter.post('/', EventsController.createEvent);
eventsRouter.delete('/:id', EventsController.deleteEvent);
eventsRouter.patch('/:id', EventsController.updateEvent);

export default eventsRouter
