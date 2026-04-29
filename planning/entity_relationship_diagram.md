# Entity Relationship Diagram

## List of Tables

- **users** — stores registered user accounts (authenticated via Firebase)
- **event_types** — lookup table for event type categories
- **events** — gift-giving occasions created by a user
- **contacts** — people the user knows and buys gifts for
- **event_contacts** — join table linking events to contacts (many-to-many)
- **gift_ideas** — individual gift ideas assigned to a contact and optionally an event

## Entity Relationship Diagram

<img width="1092" height="383" alt="image" src="https://github.com/user-attachments/assets/a871bbff-2331-4aa1-a5d0-8668cdcf1a94" />

## Table Definitions

### users

| Column Name | Type         | Constraints             | Description                              |
|-------------|--------------|-------------------------|------------------------------------------|
| id          | VARCHAR(128) | PRIMARY KEY             | Firebase UID                             |
| name        | VARCHAR(127) | NOT NULL                | user's display name                      |

### event_types

| Column Name | Type         | Constraints             | Description                              |
|-------------|--------------|-------------------------|------------------------------------------|
| id          | SERIAL       | PRIMARY KEY             | auto-incrementing integer                |
| name        | VARCHAR(127) | UNIQUE, NOT NULL        | event type label (e.g. "Birthday")       |
| color       | VARCHAR(31)  | DEFAULT '#94a3b8'       | hex color used for UI badges             |

### events

| Column Name | Type           | Constraints                          | Description                              |
|-------------|----------------|--------------------------------------|------------------------------------------|
| id          | SERIAL         | PRIMARY KEY                          | auto-incrementing integer                |
| user_id     | VARCHAR(128)   | NOT NULL, FK → users.id              | owning user                              |
| name        | VARCHAR(255)   | NOT NULL                             | event name                               |
| type_id     | INT            | NOT NULL, FK → event_types.id        | event category                           |
| description | TEXT           |                                      | optional notes about the event           |
| date        | DATE           | NOT NULL                             | date of the event                        |
| budget      | DECIMAL(10,2)  |                                      | total spending budget                    |
| recurring   | BOOLEAN        | DEFAULT false                        | whether the event repeats annually       |
| image_url   | VARCHAR(512)   |                                      | custom cover image URL for this event    |

### contacts

| Column Name  | Type         | Constraints             | Description                              |
|--------------|--------------|-------------------------|------------------------------------------|
| id           | SERIAL       | PRIMARY KEY             | auto-incrementing integer                |
| user_id      | VARCHAR(128) | NOT NULL, FK → users.id | owning user                              |
| name         | VARCHAR(127) | NOT NULL                | contact's name                           |
| relationship | VARCHAR(63)  |                         | e.g. Mother, Best Friend, Colleague      |
| email        | VARCHAR(255) |                         | contact's email address                  |
| phone_number | VARCHAR(31)  |                         | contact's phone number                   |
| notes        | TEXT         |                         | freeform notes about the contact         |

### event_contacts

| Column Name | Type | Constraints                                        | Description                    |
|-------------|------|----------------------------------------------------|--------------------------------|
| event_id    | INT  | NOT NULL, FK → events.id, part of composite PK     | linked event                   |
| contact_id  | INT  | NOT NULL, FK → contacts.id, part of composite PK   | linked contact                 |

### gift_ideas

| Column Name | Type          | Constraints                   | Description                                    |
|-------------|---------------|-------------------------------|------------------------------------------------|
| id          | SERIAL        | PRIMARY KEY                   | auto-incrementing integer                      |
| contact_id  | INT           | NOT NULL, FK → contacts.id    | contact this gift is for                       |
| event_id    | INT           | FK → events.id                | event this gift is linked to (optional)        |
| name        | VARCHAR(255)  | NOT NULL                      | name of the gift idea                          |
| description | TEXT          |                               | optional description                           |
| url         | VARCHAR(512)  |                               | link to product page                           |
| price       | DECIMAL(10,2) |                               | estimated price                                |
| status      | GIFT_STATUS   | DEFAULT 'idea'                | enum: 'idea', 'purchased', 'given'             |

## Relationships

- **users** → **events**: one-to-many (a user owns many events)
- **users** → **contacts**: one-to-many (a user owns many contacts)
- **events** ↔ **contacts**: many-to-many via **event_contacts**
- **event_types** → **events**: one-to-many (an event type applies to many events)
- **contacts** → **gift_ideas**: one-to-many (a contact has many gift ideas)
- **events** → **gift_ideas**: one-to-many (an event has many gift ideas, nullable)
