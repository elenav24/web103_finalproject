# Entity Relationship Diagram

## List of Tables

- **User** — stores registered user accounts
- **Event** — gift-giving occasions created by a user
- **EventType** — lookup table for event type categories
- **Contact** — people the user knows and buys gifts for
- **GiftIdea** — individual gift ideas assigned to a contact

## Entity Relationship Diagram

<img width="1092" height="383" alt="image" src="https://github.com/user-attachments/assets/a871bbff-2331-4aa1-a5d0-8668cdcf1a94" />

## Table Definitions

### User

| Column Name | Type    | Description                        |
|-------------|---------|------------------------------------|
| id          | integer | primary key                        |
| name        | string  | user's display name                |
| email       | string  | unique login email (alternate key) |
| password    | string  | hashed password                    |

### Event

| Column Name | Type     | Description                                      |
|-------------|----------|--------------------------------------------------|
| id          | integer  | primary key                                      |
| name        | string   | event name, part of composite alternate key      |
| type        | integer  | foreign key → EventType.id                       |
| description | string   | optional description of the event                |
| date        | datetime | event date, part of composite alternate key      |

### EventType

| Column Name | Type    | Description                        |
|-------------|---------|------------------------------------|
| id          | integer | primary key                        |
| name        | string  | unique event type name (alternate key) |

### Contact

| Column Name  | Type    | Description                              |
|--------------|---------|------------------------------------------|
| id           | integer | primary key                              |
| name         | string  | contact's full name                      |
| relationship | string  | e.g. Mother, Best Friend, Colleague      |
| email        | string  | contact's email (alternate key)          |
| phone number | string  | contact's phone number (alternate key)   |

### GiftIdea

| Column Name | Type   | Description                                      |
|-------------|--------|--------------------------------------------------|
| id          | integer | primary key                                     |
| name        | string  | name of the gift idea                           |
| status      | coded   | coded value e.g. 'idea', 'purchased', 'given'   |
