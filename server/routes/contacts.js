import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import ContactsController from '../controllers/contacts.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const contactsRouter = express.Router();

contactsRouter.get('/', ContactsController.getContacts);

export default contactsRouter
