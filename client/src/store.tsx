import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type EventType = 'Birthday' | 'Holiday' | 'Anniversary' | 'Custom';
export type GiftStatus = 'Idea' | 'Purchased' | 'Given';

export interface Contact {
  id: string;
  name: string;
  relationship: string;
  email: string;
  phone: string;
}

export interface GiftEvent {
  id: string;
  name: string;
  type: EventType;
  date: string;
  budget: number;
  contactIds: string[];
  notes: string;
}

export interface GiftIdea {
  id: string;
  contactId: string;
  eventId: string;
  name: string;
  description: string;
  price: number;
  url: string;
  status: GiftStatus;
}

interface AppContextType {
  contacts: Contact[];
  events: GiftEvent[];
  giftIdeas: GiftIdea[];
  addContact: (c: Omit<Contact, 'id'>) => void;
  updateContact: (id: string, c: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
  addEvent: (e: Omit<GiftEvent, 'id'>) => string;
  updateEvent: (id: string, e: Partial<GiftEvent>) => void;
  deleteEvent: (id: string) => void;
  addGiftIdea: (g: Omit<GiftIdea, 'id'>) => void;
  updateGiftIdea: (id: string, g: Partial<GiftIdea>) => void;
  deleteGiftIdea: (id: string) => void;
  getContactEvents: (contactId: string) => GiftEvent[];
  getContactGiftIdeas: (contactId: string) => GiftIdea[];
  getEventGiftIdeas: (eventId: string) => GiftIdea[];
  getTotalBudgetForContact: (contactId: string) => number;
  getGiftIdeasCountForContact: (contactId: string) => number;
  getNextEventForContact: (contactId: string) => GiftEvent | null;
  getSpentForEvent: (eventId: string) => number;
}

const AppContext = createContext<AppContextType | null>(null);

const generateId = () => Math.random().toString(36).substring(2, 11) + Date.now().toString(36);

const INITIAL_CONTACTS: Contact[] = [
  { id: 'c1', name: 'Sarah Johnson', relationship: 'Mother', email: 'sarah.johnson@example.com', phone: '555-0101' },
  { id: 'c2', name: 'John Smith', relationship: 'Best Friend', email: 'john.smith@example.com', phone: '555-0102' },
  { id: 'c3', name: 'Emma Davis', relationship: 'Sister', email: 'emma.davis@example.com', phone: '555-0103' },
  { id: 'c4', name: 'Robert Johnson', relationship: 'Father', email: 'robert.johnson@example.com', phone: '555-0104' },
  { id: 'c5', name: 'Mike Wilson', relationship: 'Colleague', email: 'mike.wilson@example.com', phone: '555-0105' },
  { id: 'c6', name: 'Lisa Brown', relationship: 'Niece', email: 'lisa.brown@example.com', phone: '555-0106' },
];

const INITIAL_EVENTS: GiftEvent[] = [
  { id: 'e1', name: "Sarah's Birthday", type: 'Birthday', date: '2026-05-15', budget: 200, contactIds: ['c1'], notes: 'Mom loves gardening gifts' },
  { id: 'e2', name: 'Christmas 2026', type: 'Holiday', date: '2026-12-25', budget: 800, contactIds: ['c2', 'c3', 'c5', 'c6'], notes: 'Family Christmas celebration' },
  { id: 'e3', name: "Robert's Retirement Party", type: 'Custom', date: '2026-08-20', budget: 250, contactIds: ['c4', 'c1'], notes: 'Dad is retiring after 30 years!' },
  { id: 'e4', name: "Lisa's Birthday", type: 'Birthday', date: '2026-07-12', budget: 180, contactIds: ['c6'], notes: '' },
  { id: 'e5', name: "Emma's Anniversary", type: 'Anniversary', date: '2026-09-14', budget: 250, contactIds: ['c3'], notes: '' },
  { id: 'e6', name: "John's Birthday", type: 'Birthday', date: '2026-03-08', budget: 150, contactIds: ['c2'], notes: '' },
  { id: 'e7', name: "Robert's Birthday", type: 'Birthday', date: '2026-12-15', budget: 100, contactIds: ['c4'], notes: '' },
];

const INITIAL_GIFT_IDEAS: GiftIdea[] = [
  { id: 'g1', contactId: 'c1', eventId: 'e1', name: 'Gardening Kit', description: 'Premium gardening tool set with trowel, pruners, and gloves', price: 65, url: 'https://example.com/garden-kit', status: 'Purchased' },
  { id: 'g2', contactId: 'c1', eventId: 'e1', name: 'Flower Seed Collection', description: 'Rare heirloom flower seed pack with 20 varieties', price: 25, url: '', status: 'Idea' },
  { id: 'g3', contactId: 'c1', eventId: 'e1', name: 'Garden Gloves', description: 'Premium leather gardening gloves', price: 35, url: '', status: 'Idea' },
  { id: 'g4', contactId: 'c1', eventId: 'e3', name: 'Family Photo Album', description: 'Custom printed family photo book as a gift for the party', price: 45, url: 'https://example.com/photobook', status: 'Idea' },
  { id: 'g5', contactId: 'c1', eventId: 'e1', name: 'Italian Cookbook', description: 'Authentic Italian cooking cookbook, hardcover', price: 30, url: '', status: 'Given' },
  { id: 'g6', contactId: 'c2', eventId: 'e2', name: 'Wireless Headphones', description: 'Sony WH-1000XM5 noise-cancelling headphones', price: 80, url: 'https://example.com/headphones', status: 'Purchased' },
  { id: 'g7', contactId: 'c2', eventId: 'e2', name: 'Coffee Subscription', description: '3-month specialty coffee subscription box', price: 50, url: '', status: 'Idea' },
  { id: 'g8', contactId: 'c2', eventId: 'e2', name: 'Strategy Board Game', description: 'Catan deluxe edition', price: 45, url: '', status: 'Idea' },
  { id: 'g9', contactId: 'c2', eventId: 'e6', name: 'Whiskey Tasting Set', description: 'Premium whiskey sampler with 6 mini bottles', price: 60, url: '', status: 'Given' },
  { id: 'g10', contactId: 'c2', eventId: 'e2', name: 'Smart Watch Band', description: 'Apple Watch sport band, ocean blue', price: 40, url: '', status: 'Idea' },
  { id: 'g11', contactId: 'c2', eventId: 'e6', name: 'Running Shoes', description: 'Nike Pegasus training shoes', price: 35, url: '', status: 'Purchased' },
  { id: 'g12', contactId: 'c2', eventId: 'e2', name: 'Sci-Fi Book Set', description: 'Dune trilogy hardcover collection', price: 25, url: '', status: 'Idea' },
  { id: 'g13', contactId: 'c2', eventId: 'e2', name: 'BBQ Grilling Kit', description: 'Stainless steel BBQ accessories 10-piece set', price: 15, url: '', status: 'Idea' },
  { id: 'g14', contactId: 'c3', eventId: 'e2', name: 'Luxury Skincare Set', description: 'La Mer moisturizing gift collection', price: 60, url: '', status: 'Purchased' },
  { id: 'g15', contactId: 'c3', eventId: 'e2', name: 'Cashmere Scarf', description: 'Soft cashmere winter scarf in blush pink', price: 45, url: '', status: 'Idea' },
  { id: 'g16', contactId: 'c3', eventId: 'e5', name: 'Engraved Jewelry Box', description: 'Wooden jewelry box with custom engraving', price: 50, url: '', status: 'Idea' },
  { id: 'g17', contactId: 'c3', eventId: 'e2', name: 'Premium Wine Set', description: 'Curated selection of 3 Italian red wines', price: 55, url: '', status: 'Idea' },
  { id: 'g18', contactId: 'c3', eventId: 'e5', name: 'Spa Day Voucher', description: 'Full day spa treatment at The Spa Collection', price: 25, url: '', status: 'Idea' },
  { id: 'g19', contactId: 'c3', eventId: 'e2', name: 'Book Club Subscription', description: '2-month Bookly subscription service', price: 15, url: '', status: 'Idea' },
  { id: 'g20', contactId: 'c4', eventId: 'e3', name: 'Golf Club Set', description: 'Callaway beginner golf set with bag', price: 120, url: '', status: 'Idea' },
  { id: 'g21', contactId: 'c4', eventId: 'e3', name: 'Engraved Wristwatch', description: 'Classic Seiko watch with retirement engraving', price: 95, url: 'https://example.com/watch', status: 'Purchased' },
  { id: 'g22', contactId: 'c4', eventId: 'e7', name: 'Professional Fishing Rod', description: 'Shimano spinning rod and reel combo', price: 55, url: '', status: 'Idea' },
  { id: 'g23', contactId: 'c4', eventId: 'e7', name: 'Retirement Reading Set', description: 'Collection of 5 bestselling non-fiction books', price: 30, url: '', status: 'Idea' },
  { id: 'g24', contactId: 'c5', eventId: 'e2', name: 'Bamboo Desk Organizer', description: 'Eco-friendly desk organizer with pen holder', price: 35, url: '', status: 'Idea' },
  { id: 'g25', contactId: 'c5', eventId: 'e2', name: 'Gourmet Coffee Sampler', description: 'Specialty coffee from 5 different countries', price: 40, url: '', status: 'Purchased' },
  { id: 'g26', contactId: 'c5', eventId: 'e2', name: 'Leather Journal Set', description: 'A5 leather journal with premium pen', price: 25, url: '', status: 'Idea' },
  { id: 'g27', contactId: 'c6', eventId: 'e4', name: 'Watercolor Art Set', description: 'Professional 48-color watercolor paint set', price: 35, url: '', status: 'Idea' },
  { id: 'g28', contactId: 'c6', eventId: 'e4', name: 'Fantasy Book Series', description: 'Mistborn trilogy hardcover set', price: 25, url: 'https://example.com/books', status: 'Purchased' },
  { id: 'g29', contactId: 'c6', eventId: 'e2', name: 'School Backpack', description: 'JanSport 25L backpack in teal', price: 40, url: '', status: 'Idea' },
  { id: 'g30', contactId: 'c6', eventId: 'e4', name: 'Family Board Game', description: 'Ticket to Ride Europe edition', price: 30, url: '', status: 'Idea' },
  { id: 'g31', contactId: 'c6', eventId: 'e2', name: 'Amazon Gift Card', description: '$20 Amazon digital gift card', price: 20, url: '', status: 'Idea' },
  { id: 'g32', contactId: 'c6', eventId: 'e4', name: 'DIY Jewelry Kit', description: 'Bracelet and necklace making craft kit', price: 20, url: '', status: 'Idea' },
  { id: 'g33', contactId: 'c6', eventId: 'e4', name: 'Kids Wireless Headphones', description: 'JLab JBuddies volume-safe headphones', price: 10, url: '', status: 'Idea' },
];

const STORAGE_KEY = 'giftgiver_data';

function loadFromStorage(): { contacts: Contact[]; events: GiftEvent[]; giftIdeas: GiftIdea[] } | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

function saveToStorage(data: { contacts: Contact[]; events: GiftEvent[]; giftIdeas: GiftIdea[] }) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

export function AppProvider({ children }: { children: ReactNode }) {
  const stored = loadFromStorage();
  const [contacts, setContacts] = useState<Contact[]>(stored?.contacts ?? INITIAL_CONTACTS);
  const [events, setEvents] = useState<GiftEvent[]>(stored?.events ?? INITIAL_EVENTS);
  const [giftIdeas, setGiftIdeas] = useState<GiftIdea[]>(stored?.giftIdeas ?? INITIAL_GIFT_IDEAS);

  useEffect(() => {
    saveToStorage({ contacts, events, giftIdeas });
  }, [contacts, events, giftIdeas]);

  const addContact = (c: Omit<Contact, 'id'>) =>
    setContacts(prev => [...prev, { ...c, id: generateId() }]);

  const updateContact = (id: string, c: Partial<Contact>) =>
    setContacts(prev => prev.map(x => x.id === id ? { ...x, ...c } : x));

  const deleteContact = (id: string) => {
    setContacts(prev => prev.filter(x => x.id !== id));
    setEvents(prev => prev.map(e => ({ ...e, contactIds: e.contactIds.filter(cid => cid !== id) })));
    setGiftIdeas(prev => prev.filter(g => g.contactId !== id));
  };

  const addEvent = (e: Omit<GiftEvent, 'id'>) => {
    const id = generateId();
    setEvents(prev => [...prev, { ...e, id }]);
    return id;
  };

  const updateEvent = (id: string, e: Partial<GiftEvent>) =>
    setEvents(prev => prev.map(x => x.id === id ? { ...x, ...e } : x));

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(x => x.id !== id));
    setGiftIdeas(prev => prev.map(g => g.eventId === id ? { ...g, eventId: '' } : g));
  };

  const addGiftIdea = (g: Omit<GiftIdea, 'id'>) =>
    setGiftIdeas(prev => [...prev, { ...g, id: generateId() }]);

  const updateGiftIdea = (id: string, g: Partial<GiftIdea>) =>
    setGiftIdeas(prev => prev.map(x => x.id === id ? { ...x, ...g } : x));

  const deleteGiftIdea = (id: string) =>
    setGiftIdeas(prev => prev.filter(x => x.id !== id));

  const getContactEvents = (contactId: string) =>
    events.filter(e => e.contactIds.includes(contactId)).sort((a, b) => a.date.localeCompare(b.date));

  const getContactGiftIdeas = (contactId: string) =>
    giftIdeas.filter(g => g.contactId === contactId);

  const getEventGiftIdeas = (eventId: string) =>
    giftIdeas.filter(g => g.eventId === eventId);

  const getTotalBudgetForContact = (contactId: string) =>
    giftIdeas.filter(g => g.contactId === contactId).reduce((sum, g) => sum + g.price, 0);

  const getGiftIdeasCountForContact = (contactId: string) =>
    giftIdeas.filter(g => g.contactId === contactId).length;

  const getNextEventForContact = (contactId: string): GiftEvent | null => {
    const today = new Date().toISOString().split('T')[0];
    const upcoming = events
      .filter(e => e.contactIds.includes(contactId) && e.date >= today)
      .sort((a, b) => a.date.localeCompare(b.date));
    return upcoming[0] ?? null;
  };

  const getSpentForEvent = (eventId: string) =>
    giftIdeas.filter(g => g.eventId === eventId).reduce((sum, g) => sum + g.price, 0);

  return (
    <AppContext.Provider value={{
      contacts, events, giftIdeas,
      addContact, updateContact, deleteContact,
      addEvent, updateEvent, deleteEvent,
      addGiftIdea, updateGiftIdea, deleteGiftIdea,
      getContactEvents, getContactGiftIdeas, getEventGiftIdeas,
      getTotalBudgetForContact, getGiftIdeasCountForContact, getNextEventForContact, getSpentForEvent,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
