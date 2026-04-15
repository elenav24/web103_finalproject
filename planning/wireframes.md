# Wireframes

## List of Pages

- ⭐ Event Dashboard — main landing page after login; shows all upcoming gift-giving events as cards with budget progress
- ⭐ Contact Directory — lists all contacts with their next upcoming event, total budget, and number of gift ideas
- ⭐ Create New Event — form page for adding a new gift-giving event with name, type, date, budget, recipients, and notes
- Contact Profile — individual contact page showing their events, gift idea list, and budget breakdown
- Gift Ideas — view and manage the list of gift ideas for a specific contact/event
- Add Contact — form for adding a new contact with name, relationship, and profile details

## Wireframe 1: Event Dashboard

The main dashboard view after a user logs in. Displays all upcoming gift-giving events as a grid of cards. Each card shows:
- Event name and type badge (e.g. Holiday, Birthday, Custom Event)
- Event date
- A circular progress indicator showing budget used vs. total budget (e.g. 75%)
- Budget amount spent vs. total (e.g. $600.00 / $800.00)
- Avatar chips for each gift recipient linked to the event (e.g. JS, ED, MW) with a "+1 more" overflow indicator
- An "+ Add Event" button in the top right to create a new event

```
+-------------------------------------------------------+
| GiftGiver                    Dashboard  Contacts  👤  |
+-------------------------------------------------------+
| Event Dashboard                          [+ Add Event]|
| Track your upcoming gift-giving events                |
|                                                       |
| +------------------+  +------------------+           |
| | [Holiday]        |  | [Holiday]        |           |
| | [cover image]    |  | [cover image]    |           |
| | Christmas 2026   |  | Christmas 2026   |           |
| | 📅 Dec 25, 2026  |  | 📅 Dec 25, 2026  |  (75%)   |
| | $ $600 / $800    |  | $ $600 / $800    |           |
| | 👥 JS  ED  MW +1 |  | 👥 JS  ED  MW +1 |           |
| +------------------+  +------------------+           |
|                                                       |
| +------------------+  +------------------+           |
| | [Holiday]        |  | [Holiday]        |           |
| | Christmas 2026   |  | Christmas 2026   |           |
| | 📅 Dec 25, 2026  |  | 📅 Dec 25, 2026  |           |
| | $ $600 / $800    |  | $ $600 / $800    |           |
| | 👥 JS  ED  MW +1 |  | 👥 JS  ED  MW +1 |           |
| +------------------+  +------------------+           |
+-------------------------------------------------------+
```

## Wireframe 2: Contact Directory

A full list of all contacts the user is buying gifts for. Each row in the list shows:
- Contact avatar, name, and relationship label (e.g. Mother, Best Friend)
- Next upcoming event name and date, with a "+1 more" indicator if multiple events exist
- Event type badge (Birthday, Holiday, Custom Event)
- Total budget for that contact
- Number of gift ideas saved for that contact
- An "+ Add Contact" button in the top right

```
+-------------------------------------------------------+
| GiftGiver                    Dashboard  Contacts  👤  |
+-------------------------------------------------------+
| Contact Directory                      [+ Add Contact]|
| Manage your gift recipients                           |
|                                                       |
| +---------------------------------------------------+ |
| | 👤 Sarah Johnson   📅 Birthday      [Birthday]    | |
| |    Mother             May 15, 2026  $ $200  🎁 5  | |
| +---------------------------------------------------+ |
| | 👤 John Smith      📅 Christmas     [Holiday]     | |
| |    Best Friend        Dec 25, 2026  $ $350  🎁 8  | |
| |                       +1 more                     | |
| +---------------------------------------------------+ |
| | 👤 Emma Davis      📅 Christmas     [Holiday]     | |
| |    Sister             Dec 25, 2026  $ $250  🎁 6  | |
| +---------------------------------------------------+ |
| | 👤 Robert Johnson  📅 Retirement    [Custom Event]| |
| |    Father             Aug 20, 2026  $ $300  🎁 4  | |
| |                       +1 more                     | |
| +---------------------------------------------------+ |
| | 👤 Mike Wilson     📅 Christmas     [Holiday]     | |
| |    Colleague          Dec 25, 2026  $ $100  🎁 3  | |
| +---------------------------------------------------+ |
| | 👤 Lisa Brown      📅 Birthday      [Birthday]    | |
| |    Niece              Jul 12, 2026  $ $180  🎁 7  | |
| +---------------------------------------------------+ |
+-------------------------------------------------------+
```

## Wireframe 3: Create New Event

A form page for creating a new gift-giving event. Fields include:
- Event Name (text input with placeholder "e.g., Mom's Birthday, Christmas 2026")
- Event Type (dropdown: Birthday, Holiday, Anniversary, Custom Event, etc.)
- Event Date (date picker)
- Total Budget (currency input, default $0.00)
- Gift Recipients (multi-select contact picker)
- Notes (optional textarea for additional context or early gift ideas)
- Cancel and Create Event action buttons at the bottom

```
+-------------------------------------------------------+
| GiftGiver                    Dashboard  Contacts  👤  |
+-------------------------------------------------------+
|                                                       |
|         Create New Event                              |
|         Add a new gift-giving event to track          |
|                                                       |
|  +-----------------------------------------------+   |
|  | Event Name                                    |   |
|  | [e.g., Mom's Birthday, Christmas 2026       ] |   |
|  |                                               |   |
|  | Event Type            Event Date             |   |
|  | [Select type       ▼] [📅 Pick a date      ] |   |
|  |                                               |   |
|  | Total Budget                                  |   |
|  | [$ 0.00                                     ] |   |
|  |                                               |   |
|  | Gift Recipients                               |   |
|  | [Select contacts                            ] |   |
|  |                                               |   |
|  | Notes (Optional)                              |   |
|  | [Add any additional notes or gift ideas...  ] |   |
|  |                                               ] |   |
|  +-----------------------------------------------+   |
|                                                       |
|                    [Cancel] [Create Event]            |
+-------------------------------------------------------+
```
