import express from 'express'
import path from 'path'
import './config/dotenv.js'
import cors from 'cors'
import eventsRouter from './routes/events.js'
import contactsRouter from './routes/contacts.js'
import usersRouter from './routes/users.js'
import giftsRouter from './routes/gifts.js'
const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/events', eventsRouter);
app.use('/api/contacts', contactsRouter);
app.use('/api/contacts', usersRouter);
app.use('/api/gifts', giftsRouter);

app.get('/', (req, res) => {
  res.status(200).send('<h1 style="text-align: center; margin-top: 50px;">GiftGiver API');
});

app.listen(PORT, () => {
  console.log(`server listening on http://localhost:${PORT}`)
})
