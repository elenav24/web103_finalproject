import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import EventsController from '../controllers/events.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const eventsRouter = express.Router();

eventsRouter.get('/', EventsController.getEvents);

export default eventsRouter
