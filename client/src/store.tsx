import { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/auth';

export type EventType = 'Birthday' | 'Holiday' | 'Anniversary' | 'Custom';
export type GiftStatus = 'Idea' | 'Purchased' | 'Given';

export interface Contact {
  id: string;
  name: string;
  relationship: string;
  email: string;
  phone: string;
  notes?: string;
}

export interface GiftEvent {
  id: string;
  name: string;
  type: string;
  type_id: number;
  date: string;
  budget: number;
  contactIds: string[];
  notes: string;
  recurring?: boolean;
  image_url?: string;
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

export interface EventTypeOption {
  id: number;
  name: string;
  color: string;
}

interface AppContextType {
  contacts: Contact[];
  events: GiftEvent[];
  giftIdeas: GiftIdea[];
  eventTypes: EventTypeOption[];
  user: User | null;
  loading: boolean;
  addContact: (c: Omit<Contact, 'id'>) => Promise<void>;
  updateContact: (id: string, c: Partial<Contact>) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
  addEvent: (e: Omit<GiftEvent, 'id'>) => Promise<string>;
  updateEvent: (id: string, e: Partial<GiftEvent>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  addGiftIdea: (g: Omit<GiftIdea, 'id'>) => Promise<void>;
  updateGiftIdea: (id: string, g: Partial<GiftIdea>) => Promise<void>;
  deleteGiftIdea: (id: string) => Promise<void>;
  addEventType: (name: string, color: string) => Promise<EventTypeOption>;
  getContactEvents: (contactId: string) => GiftEvent[];
  getContactGiftIdeas: (contactId: string) => GiftIdea[];
  getEventGiftIdeas: (eventId: string) => GiftIdea[];
  getTotalBudgetForContact: (contactId: string) => number;
  getGiftIdeasCountForContact: (contactId: string) => number;
  getNextEventForContact: (contactId: string) => GiftEvent | null;
  getSpentForEvent: (eventId: string) => number;
}

export const AppContext = createContext<AppContextType | null>(null);

async function getToken(): Promise<string> {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error('Not authenticated');
  return token;
}

async function apiFetch(path: string, options: RequestInit = {}) {
  const token = await getToken();
  const res = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers ?? {}),
    },
  });

  if (res.status === 401 && auth.currentUser) {
    const freshToken = await auth.currentUser.getIdToken(true);
    const retry = await fetch(path, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${freshToken}`,
        ...(options.headers ?? {}),
      },
    });
    if (!retry.ok) {
      const body = await retry.json().catch(() => ({}));
      throw new Error(body.error ?? `Request failed: ${retry.status}`);
    }
    return retry.json();
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Request failed: ${res.status}`);
  }
  return res.json();
}

function rowToContact(row: Record<string, unknown>): Contact {
  return {
    id: String(row.id),
    name: row.name as string,
    relationship: (row.relationship as string) ?? '',
    email: (row.email as string) ?? '',
    phone: (row.phone_number as string) ?? '',
    notes: (row.notes as string) ?? '',
  };
}

function rowToEvent(row: Record<string, unknown>, contactIds: string[] = []): GiftEvent {
  return {
    id: String(row.id),
    name: row.name as string,
    type: (row.event_type ?? row.type) as string,
    type_id: row.type_id as number,
    date: (row.date as string).split('T')[0],
    budget: Number(row.budget ?? 0),
    contactIds,
    notes: (row.description as string) ?? '',
    recurring: (row.recurring as boolean) ?? false,
    image_url: (row.image_url as string) ?? undefined,
  };
}

function rowToGiftIdea(row: Record<string, unknown>): GiftIdea {
  const statusMap: Record<string, GiftStatus> = {
    idea: 'Idea',
    purchased: 'Purchased',
    given: 'Given',
  };
  return {
    id: String(row.id),
    contactId: String(row.contact_id),
    eventId: row.event_id ? String(row.event_id) : '',
    name: row.name as string,
    description: (row.description as string) ?? '',
    price: Number(row.price ?? 0),
    url: (row.url as string) ?? '',
    status: statusMap[(row.status as string)?.toLowerCase()] ?? 'Idea',
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [events, setEvents] = useState<GiftEvent[]>([]);
  const [giftIdeas, setGiftIdeas] = useState<GiftIdea[]>([]);
  const [eventTypes, setEventTypes] = useState<EventTypeOption[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUserData = useCallback(async (uid: string) => {
    try {
      const [contactRows, eventRows, giftRows] = await Promise.all([
        apiFetch('/api/contacts'),
        apiFetch('/api/events'),
        apiFetch('/api/gifts'),
      ]);

      if (auth.currentUser?.uid !== uid) return;

      const mappedContacts: Contact[] = contactRows.map(rowToContact);
      const mappedEvents: GiftEvent[] = eventRows.map((r: Record<string, unknown>) => rowToEvent(r));
      const mappedGifts: GiftIdea[] = giftRows.map(rowToGiftIdea);

      const contactEventPairs: { contactId: string; eventId: string }[] = [];
      await Promise.all(
        mappedContacts.map(async (c) => {
          try {
            const evRows: Record<string, unknown>[] = await apiFetch(`/api/contacts/${c.id}/events`);
            evRows.forEach((ev) => {
              if (ev.id) contactEventPairs.push({ contactId: c.id, eventId: String(ev.id) });
            });
          } catch {
            // contact has no events
          }
        })
      );

      if (auth.currentUser?.uid !== uid) return;

      const eventsWithContacts = mappedEvents.map((ev) => ({
        ...ev,
        contactIds: contactEventPairs
          .filter((p) => p.eventId === ev.id)
          .map((p) => p.contactId),
      }));

      setContacts(mappedContacts);
      setEvents(eventsWithContacts);
      setGiftIdeas(mappedGifts);
    } catch (err) {
      console.error('Failed to load user data:', err);
    }
  }, []);

  useEffect(() => {
    fetch('/api/event-types')
      .then((r) => r.json())
      .then((rows: EventTypeOption[]) => setEventTypes(rows))
      .catch(console.error);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();
          await fetch('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ name: firebaseUser.displayName ?? firebaseUser.email ?? 'User' }),
          });
        } catch {
          // user already exists
        }
        await loadUserData(firebaseUser.uid);
      } else {
        setContacts([]);
        setEvents([]);
        setGiftIdeas([]);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, [loadUserData]);

  const addContact = async (c: Omit<Contact, 'id'>) => {
    const row = await apiFetch('/api/contacts', {
      method: 'POST',
      body: JSON.stringify({
        name: c.name,
        relationship: c.relationship,
        email: c.email,
        phone_number: c.phone,
        notes: c.notes ?? '',
      }),
    });
    setContacts((prev) => [...prev, rowToContact(row)]);
  };

  const updateContact = async (id: string, c: Partial<Contact>) => {
    const current = contacts.find((x) => x.id === id)!;
    const merged = { ...current, ...c };
    const row = await apiFetch(`/api/contacts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        name: merged.name,
        relationship: merged.relationship,
        email: merged.email,
        phone_number: merged.phone,
        notes: merged.notes ?? '',
      }),
    });
    setContacts((prev) => prev.map((x) => (x.id === id ? rowToContact(row) : x)));
  };

  const deleteContact = async (id: string) => {
    await apiFetch(`/api/contacts/${id}`, { method: 'DELETE' });
    setContacts((prev) => prev.filter((x) => x.id !== id));
    setEvents((prev) =>
      prev.map((e) => ({ ...e, contactIds: e.contactIds.filter((cid) => cid !== id) }))
    );
    setGiftIdeas((prev) => prev.filter((g) => g.contactId !== id));
  };

  const addEvent = async (e: Omit<GiftEvent, 'id'>): Promise<string> => {
    const row = await apiFetch('/api/events', {
      method: 'POST',
      body: JSON.stringify({
        name: e.name,
        type_id: e.type_id,
        description: e.notes,
        date: e.date,
        budget: e.budget,
        recurring: e.recurring ?? false,
        image_url: e.image_url ?? null,
        contact_ids: e.contactIds.map(Number),
      }),
    });
    const newEvent = rowToEvent(row, e.contactIds);
    setEvents((prev) => [...prev, newEvent]);
    return newEvent.id;
  };

  const updateEvent = async (id: string, e: Partial<GiftEvent>) => {
    const current = events.find((x) => x.id === id)!;
    const merged = { ...current, ...e };
    const row = await apiFetch(`/api/events/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        name: merged.name,
        type_id: merged.type_id,
        description: merged.notes,
        date: merged.date,
        budget: merged.budget,
        recurring: merged.recurring ?? false,
        image_url: merged.image_url ?? null,
        contact_ids: merged.contactIds.map(Number),
      }),
    });
    setEvents((prev) =>
      prev.map((x) => (x.id === id ? rowToEvent(row, merged.contactIds) : x))
    );
  };

  const deleteEvent = async (id: string) => {
    await apiFetch(`/api/events/${id}`, { method: 'DELETE' });
    setEvents((prev) => prev.filter((x) => x.id !== id));
    setGiftIdeas((prev) => prev.map((g) => (g.eventId === id ? { ...g, eventId: '' } : g)));
  };

  const addGiftIdea = async (g: Omit<GiftIdea, 'id'>) => {
    const row = await apiFetch('/api/gifts', {
      method: 'POST',
      body: JSON.stringify({
        contact_id: Number(g.contactId),
        event_id: g.eventId ? Number(g.eventId) : null,
        name: g.name,
        description: g.description,
        url: g.url,
        price: g.price,
        status: g.status.toLowerCase(),
      }),
    });
    setGiftIdeas((prev) => [...prev, rowToGiftIdea(row)]);
  };

  const updateGiftIdea = async (id: string, g: Partial<GiftIdea>) => {
    const current = giftIdeas.find((x) => x.id === id)!;
    const merged = { ...current, ...g };
    const row = await apiFetch(`/api/gifts/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        name: merged.name,
        description: merged.description,
        url: merged.url,
        price: merged.price,
        status: merged.status.toLowerCase(),
      }),
    });
    setGiftIdeas((prev) => prev.map((x) => (x.id === id ? rowToGiftIdea(row) : x)));
  };

  const deleteGiftIdea = async (id: string) => {
    await apiFetch(`/api/gifts/${id}`, { method: 'DELETE' });
    setGiftIdeas((prev) => prev.filter((x) => x.id !== id));
  };

  const addEventType = async (name: string, color: string): Promise<EventTypeOption> => {
    const token = await getToken();
    const res = await fetch('/api/event-types', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name, color }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error ?? 'Failed to create event type');
    }
    const row: EventTypeOption = await res.json();
    setEventTypes((prev) => {
      const exists = prev.find((t) => t.id === row.id);
      return exists ? prev.map((t) => (t.id === row.id ? row : t)) : [...prev, row];
    });
    return row;
  };

  const getContactEvents = (contactId: string) =>
    events.filter((e) => e.contactIds.includes(contactId)).sort((a, b) => a.date.localeCompare(b.date));

  const getContactGiftIdeas = (contactId: string) =>
    giftIdeas.filter((g) => g.contactId === contactId);

  const getEventGiftIdeas = (eventId: string) =>
    giftIdeas.filter((g) => g.eventId === eventId);

  const getTotalBudgetForContact = (contactId: string) =>
    giftIdeas.filter((g) => g.contactId === contactId).reduce((sum, g) => sum + g.price, 0);

  const getGiftIdeasCountForContact = (contactId: string) =>
    giftIdeas.filter((g) => g.contactId === contactId).length;

  const getNextEventForContact = (contactId: string): GiftEvent | null => {
    const today = new Date().toLocaleDateString('en-CA');
    const upcoming = events
      .filter((e) => e.contactIds.includes(contactId) && e.date >= today)
      .sort((a, b) => a.date.localeCompare(b.date));
    return upcoming[0] ?? null;
  };

  const getSpentForEvent = (eventId: string) =>
    giftIdeas.filter((g) => g.eventId === eventId).reduce((sum, g) => sum + g.price, 0);

  return (
    <AppContext.Provider
      value={{
        contacts, events, giftIdeas, eventTypes, user, loading,
        addContact, updateContact, deleteContact,
        addEvent, updateEvent, deleteEvent,
        addGiftIdea, updateGiftIdea, deleteGiftIdea,
        addEventType,
        getContactEvents, getContactGiftIdeas, getEventGiftIdeas,
        getTotalBudgetForContact, getGiftIdeasCountForContact,
        getNextEventForContact, getSpentForEvent,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
