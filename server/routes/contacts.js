import express from 'express'
import ContactsController from '../controllers/contacts.js'
import { verifyToken } from '../middleware/auth.js'

const contactsRouter = express.Router();

contactsRouter.use(verifyToken);

contactsRouter.get('/', ContactsController.getContacts);
contactsRouter.post('/', ContactsController.createContact);
contactsRouter.patch('/:id', ContactsController.updateContact);
contactsRouter.delete('/:id', ContactsController.deleteContact);
contactsRouter.get('/:id/events', ContactsController.getContactEvents);

export default contactsRouter;
