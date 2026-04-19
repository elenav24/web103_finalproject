import './dotenv.js'
import { pool } from './database.js'
import userData from '../data/users.js'
import contactData from '../data/contacts.js'
import eventTypeData from '../data/event_types.js'
import eventData from '../data/events.js'
import eventContactData from '../data/event_contacts.js'
import giftIdeaData from '../data/gift_ideas.js'

const createUsersTable = async () => {
  const createTableQuery = `
    DROP TABLE IF EXISTS gift_ideas;
    DROP TABLE IF EXISTS event_contacts;
    DROP TABLE IF EXISTS events;
    DROP TABLE IF EXISTS contacts;
    DROP TABLE IF EXISTS event_types;
    DROP TABLE IF EXISTS users;

    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(127) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL
    );
  `

  try {
    await pool.query(createTableQuery)
    console.log({ message: '🎉 users table created successfully' })
  } catch (error) {
    console.error({ message: 'error creating users table', error })
    throw error
  }
}

const seedUsersTable = async () => {
  await createUsersTable()

  try {
    await Promise.all(userData.map((user) => {
      const insertQuery = `
        INSERT INTO users (id, name, email, password)
        VALUES ($1, $2, $3, $4);
      `
      const values = [user.id, user.name, user.email, user.password]
      return pool.query(insertQuery, values)
    }))
    console.log({ message: '✅ users seeded successfully' })
  } catch (err) {
    console.error({ message: 'error seeding users', err })
    throw err
  }
}

const createEventTypesTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS event_types (
      id SERIAL PRIMARY KEY,
      name VARCHAR(127) UNIQUE NOT NULL
    );
  `

  try {
    await pool.query(createTableQuery)
    console.log({ message: '🎉 event_types table created successfully' })
  } catch (error) {
    console.error({ message: 'error creating event_types table', error })
    throw error
  }
}

const seedEventTypesTable = async () => {
  await createEventTypesTable()

  try {
    await Promise.all(eventTypeData.map((eventType) => {
      const insertQuery = `
        INSERT INTO event_types (id, name)
        VALUES ($1, $2);
      `
      const values = [eventType.id, eventType.name]
      return pool.query(insertQuery, values)
    }))
    console.log({ message: '✅ event_types seeded successfully' })
  } catch (err) {
    console.error({ message: 'error seeding event_types', err })
    throw err
  }
}

const createContactsTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS contacts (
      id SERIAL PRIMARY KEY,
      user_id INT NOT NULL,
      name VARCHAR(127) NOT NULL,
      relationship VARCHAR(63),
      email VARCHAR(255),
      phone_number VARCHAR(31),
      notes TEXT,

      FOREIGN KEY (user_id) REFERENCES users(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
    );
  `

  try {
    await pool.query(createTableQuery)
    console.log({ message: '🎉 contacts table created successfully' })
  } catch (error) {
    console.error({ message: 'error creating contacts table', error })
    throw error
  }
}

const seedContactsTable = async () => {
  await createContactsTable()

  try {
    await Promise.all(contactData.map((contact) => {
      const insertQuery = `
        INSERT INTO contacts (id, user_id, name, relationship, email, phone_number, notes)
        VALUES ($1, $2, $3, $4, $5, $6, $7);
      `
      const values = [
        contact.id,
        contact.user_id,
        contact.name,
        contact.relationship,
        contact.email,
        contact.phone_number,
        contact.notes
      ]
      return pool.query(insertQuery, values)
    }))
    console.log({ message: '✅ contacts seeded successfully' })
  } catch (err) {
    console.error({ message: 'error seeding contacts', err })
    throw err
  }
}

const createEventsTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS events (
      id SERIAL PRIMARY KEY,
      user_id INT NOT NULL,
      name VARCHAR(255) NOT NULL,
      type_id INT NOT NULL,
      description TEXT,
      date DATE NOT NULL,
      budget DECIMAL(10, 2),
      recurring BOOLEAN DEFAULT false,

      FOREIGN KEY (user_id) REFERENCES users(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
      FOREIGN KEY (type_id) REFERENCES event_types(id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
    );
  `

  try {
    await pool.query(createTableQuery)
    console.log({ message: '🎉 events table created successfully' })
  } catch (error) {
    console.error({ message: 'error creating events table', error })
    throw error
  }
}

const seedEventsTable = async () => {
  await createEventsTable()

  try {
    await Promise.all(eventData.map((event) => {
      const insertQuery = `
        INSERT INTO events (id, user_id, name, type_id, description, date, budget, recurring)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
      `
      const values = [
        event.id,
        event.user_id,
        event.name,
        event.type_id,
        event.description,
        event.date,
        event.budget,
        event.recurring
      ]
      return pool.query(insertQuery, values)
    }))
    console.log({ message: '✅ events seeded successfully' })
  } catch (err) {
    console.error({ message: 'error seeding events', err })
    throw err
  }
}

const createEventContactsTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS event_contacts (
      event_id INT NOT NULL,
      contact_id INT NOT NULL,
      PRIMARY KEY (event_id, contact_id),

      FOREIGN KEY (event_id) REFERENCES events(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
      FOREIGN KEY (contact_id) REFERENCES contacts(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
    );
  `

  try {
    await pool.query(createTableQuery)
    console.log({ message: '🎉 event_contacts table created successfully' })
  } catch (error) {
    console.error({ message: 'error creating event_contacts table', error })
    throw error
  }
}

const seedEventContactsTable = async () => {
  await createEventContactsTable()

  try {
    await Promise.all(eventContactData.map((ec) => {
      const insertQuery = `
        INSERT INTO event_contacts (event_id, contact_id)
        VALUES ($1, $2);
      `
      const values = [ec.event_id, ec.contact_id]
      return pool.query(insertQuery, values)
    }))
    console.log({ message: '✅ event_contacts seeded successfully' })
  } catch (err) {
    console.error({ message: 'error seeding event_contacts', err })
    throw err
  }
}

const createGiftIdeasTable = async () => {
  const createEnumQuery = `
    DO $$ BEGIN
      CREATE TYPE GIFT_STATUS AS ENUM ('idea', 'purchased', 'given');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `

  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS gift_ideas (
      id SERIAL PRIMARY KEY,
      contact_id INT NOT NULL,
      event_id INT,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      url VARCHAR(512),
      price DECIMAL(10, 2),
      status GIFT_STATUS DEFAULT 'idea',

      FOREIGN KEY (contact_id) REFERENCES contacts(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
      FOREIGN KEY (event_id) REFERENCES events(id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
    );
  `

  try {
    await pool.query(createEnumQuery)
    await pool.query(createTableQuery)
    console.log({ message: '🎉 gift_ideas table created successfully' })
  } catch (error) {
    console.error({ message: 'error creating gift_ideas table', error })
    throw error
  }
}

const seedGiftIdeasTable = async () => {
  await createGiftIdeasTable()

  try {
    await Promise.all(giftIdeaData.map((gift) => {
      const insertQuery = `
        INSERT INTO gift_ideas (id, contact_id, event_id, name, description, url, price, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
      `
      const values = [
        gift.id,
        gift.contact_id,
        gift.event_id,
        gift.name,
        gift.description,
        gift.url,
        gift.price,
        gift.status
      ]
      return pool.query(insertQuery, values)
    }))
    console.log({ message: '✅ gift_ideas seeded successfully' })
  } catch (err) {
    console.error({ message: 'error seeding gift_ideas', err })
    throw err
  }
}

const seed = async () => {
  try {
    await seedUsersTable()
    await seedEventTypesTable()
    await seedContactsTable()
    await seedEventsTable()
    await seedEventContactsTable()
    await seedGiftIdeasTable()
  } catch (err) {
    console.error({ message: 'seeding failed', err })
  }
  pool.end()
}

seed()
