import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
  ArrowLeft, Edit2, Trash2, Plus, X, ExternalLink, Calendar, DollarSign,
  Gift, Mail, Phone, User, ChevronDown, Check
} from 'lucide-react';
import { useApp, Contact, GiftEvent, GiftIdea, GiftStatus, EventType } from '../store';

const STATUS_BADGE: Record<GiftStatus, string> = {
  Idea: 'bg-gray-100 text-gray-600',
  Purchased: 'bg-blue-100 text-blue-700',
  Given: 'bg-emerald-100 text-emerald-700',
};

const EVENT_TYPE_BADGE: Record<EventType, string> = {
  Birthday: 'bg-pink-50 text-pink-700 border-pink-100',
  Holiday: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  Anniversary: 'bg-rose-50 text-rose-700 border-rose-100',
  Custom: 'bg-blue-50 text-blue-700 border-blue-100',
};

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function formatDate(date: string) {
  const d = new Date(date + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

interface GiftIdeaModalProps {
  contactId: string;
  events: GiftEvent[];
  onClose: () => void;
  editIdea?: GiftIdea | null;
}

function GiftIdeaModal({ contactId, events, onClose, editIdea }: GiftIdeaModalProps) {
  const { addGiftIdea, updateGiftIdea } = useApp();
  const [name, setName] = useState(editIdea?.name ?? '');
  const [description, setDescription] = useState(editIdea?.description ?? '');
  const [price, setPrice] = useState(editIdea ? String(editIdea.price) : '');
  const [url, setUrl] = useState(editIdea?.url ?? '');
  const [eventId, setEventId] = useState(editIdea?.eventId ?? (events[0]?.id ?? ''));
  const [status, setStatus] = useState<GiftStatus>(editIdea?.status ?? 'Idea');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Name is required';
    if (!price || isNaN(Number(price)) || Number(price) < 0) e.price = 'Valid price required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const payload = { contactId, eventId, name: name.trim(), description: description.trim(), price: Number(price), url: url.trim(), status };
    if (editIdea) {
      updateGiftIdea(editIdea.id, payload);
    } else {
      addGiftIdea(payload);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-[20px] font-semibold text-[#0a0a0a]">{editIdea ? 'Edit Gift Idea' : 'Add Gift Idea'}</h2>
            <p className="text-[14px] text-[#717182] mt-0.5">Track a gift you'd like to give</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <X size={18} className="text-gray-500" />
          </button>
        </div>
        <div className="p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-medium text-[#0a0a0a]">Gift Name</label>
            <input
              className="bg-[#f3f3f5] rounded-lg px-3 py-2 text-[14px] outline-none focus:ring-2 focus:ring-black/10 placeholder:text-[#717182]"
              placeholder="e.g., Wireless Headphones"
              value={name} onChange={e => setName(e.target.value)}
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-medium text-[#0a0a0a]">Description</label>
            <textarea
              className="bg-[#f3f3f5] rounded-lg px-3 py-2 text-[14px] outline-none focus:ring-2 focus:ring-black/10 resize-none placeholder:text-[#717182]"
              placeholder="Brief description of the gift..."
              rows={2}
              value={description} onChange={e => setDescription(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-medium text-[#0a0a0a]">Price Estimate</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#717182] text-[14px]">$</span>
                <input
                  type="number" min="0" step="0.01"
                  className="bg-[#f3f3f5] rounded-lg pl-7 pr-3 py-2 text-[14px] outline-none focus:ring-2 focus:ring-black/10 w-full"
                  placeholder="0.00"
                  value={price} onChange={e => setPrice(e.target.value)}
                />
              </div>
              {errors.price && <p className="text-xs text-red-500">{errors.price}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-medium text-[#0a0a0a]">Status</label>
              <select
                className="bg-[#f3f3f5] rounded-lg px-3 py-2 text-[14px] outline-none focus:ring-2 focus:ring-black/10 appearance-none cursor-pointer"
                value={status} onChange={e => setStatus(e.target.value as GiftStatus)}
              >
                <option value="Idea">Idea</option>
                <option value="Purchased">Purchased</option>
                <option value="Given">Given</option>
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-medium text-[#0a0a0a]">Product URL (Optional)</label>
            <input
              type="url"
              className="bg-[#f3f3f5] rounded-lg px-3 py-2 text-[14px] outline-none focus:ring-2 focus:ring-black/10 placeholder:text-[#717182]"
              placeholder="https://..."
              value={url} onChange={e => setUrl(e.target.value)}
            />
          </div>
          {events.length > 0 && (
            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-medium text-[#0a0a0a]">Link to Event</label>
              <select
                className="bg-[#f3f3f5] rounded-lg px-3 py-2 text-[14px] outline-none focus:ring-2 focus:ring-black/10 appearance-none cursor-pointer"
                value={eventId} onChange={e => setEventId(e.target.value)}
              >
                <option value="">— No event —</option>
                {events.map(ev => (
                  <option key={ev.id} value={ev.id}>{ev.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>
        <div className="p-6 pt-0 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-[rgba(0,0,0,0.1)] text-[14px] font-medium text-[#0a0a0a] hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={handleSubmit} className="px-4 py-2 rounded-lg bg-[#0a0a0a] text-[14px] font-medium text-white hover:bg-[#333] transition-colors">
            {editIdea ? 'Save Changes' : 'Add Gift Idea'}
          </button>
        </div>
      </div>
    </div>
  );
}

interface EventModalProps {
  contactId: string;
  onClose: () => void;
  editEvent?: GiftEvent | null;
}

function EventModal({ contactId, onClose, editEvent }: EventModalProps) {
  const { contacts, addEvent, updateEvent } = useApp();
  const [name, setName] = useState(editEvent?.name ?? '');
  const [type, setType] = useState<EventType>(editEvent?.type ?? 'Birthday');
  const [date, setDate] = useState(editEvent?.date ?? '');
  const [budget, setBudget] = useState(editEvent ? String(editEvent.budget) : '');
  const [notes, setNotes] = useState(editEvent?.notes ?? '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Event name is required';
    if (!date) e.date = 'Date is required';
    if (!budget || isNaN(Number(budget)) || Number(budget) < 0) e.budget = 'Valid budget required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const existing = editEvent?.contactIds ?? [];
    const contactIds = existing.includes(contactId) ? existing : [...existing, contactId];
    const payload = { name: name.trim(), type, date, budget: Number(budget), contactIds, notes };
    if (editEvent) {
      updateEvent(editEvent.id, payload);
    } else {
      addEvent(payload);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-[20px] font-semibold text-[#0a0a0a]">{editEvent ? 'Edit Event' : 'Add Event'}</h2>
            <p className="text-[14px] text-[#717182] mt-0.5">Track an event for this contact</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <X size={18} className="text-gray-500" />
          </button>
        </div>
        <div className="p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-medium text-[#0a0a0a]">Event Name</label>
            <input
              className="bg-[#f3f3f5] rounded-lg px-3 py-2 text-[14px] outline-none focus:ring-2 focus:ring-black/10 placeholder:text-[#717182]"
              placeholder="e.g., Mom's Birthday"
              value={name} onChange={e => setName(e.target.value)}
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-medium text-[#0a0a0a]">Event Type</label>
              <select
                className="bg-[#f3f3f5] rounded-lg px-3 py-2 text-[14px] outline-none focus:ring-2 focus:ring-black/10 appearance-none cursor-pointer"
                value={type} onChange={e => setType(e.target.value as EventType)}
              >
                <option value="Birthday">Birthday</option>
                <option value="Holiday">Holiday</option>
                <option value="Anniversary">Anniversary</option>
                <option value="Custom">Custom</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-medium text-[#0a0a0a]">Date</label>
              <input
                type="date"
                className="bg-white border border-[rgba(0,0,0,0.1)] rounded-lg px-3 py-2 text-[14px] outline-none focus:ring-2 focus:ring-black/10"
                value={date} onChange={e => setDate(e.target.value)}
              />
              {errors.date && <p className="text-xs text-red-500">{errors.date}</p>}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-medium text-[#0a0a0a]">Total Budget</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#717182] text-[14px]">$</span>
              <input
                type="number" min="0" step="0.01"
                className="bg-[#f3f3f5] rounded-lg pl-7 pr-3 py-2 text-[14px] outline-none focus:ring-2 focus:ring-black/10 w-full"
                placeholder="0.00"
                value={budget} onChange={e => setBudget(e.target.value)}
              />
            </div>
            {errors.budget && <p className="text-xs text-red-500">{errors.budget}</p>}
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-medium text-[#0a0a0a]">Notes (Optional)</label>
            <textarea
              className="bg-[#f3f3f5] rounded-lg px-3 py-2 text-[14px] outline-none focus:ring-2 focus:ring-black/10 resize-none placeholder:text-[#717182]"
              placeholder="Any notes about this event..."
              rows={2}
              value={notes} onChange={e => setNotes(e.target.value)}
            />
          </div>
        </div>
        <div className="p-6 pt-0 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-[rgba(0,0,0,0.1)] text-[14px] font-medium text-[#0a0a0a] hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={handleSubmit} className="px-4 py-2 rounded-lg bg-[#0a0a0a] text-[14px] font-medium text-white hover:bg-[#333] transition-colors">
            {editEvent ? 'Save Changes' : 'Add Event'}
          </button>
        </div>
      </div>
    </div>
  );
}

function BudgetProgress({ spent, budget }: { spent: number; budget: number }) {
  const pct = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;
  const rawPct = budget > 0 ? (spent / budget) * 100 : 0;
  const barColor = rawPct > 100 ? 'bg-red-500' : rawPct >= 80 ? 'bg-amber-400' : 'bg-emerald-500';
  const textColor = rawPct > 100 ? 'text-red-600' : rawPct >= 80 ? 'text-amber-600' : 'text-emerald-600';

  return (
    <div className="mt-3">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-[13px] text-[#717182]">Budget Used</span>
        <span className={`text-[13px] font-medium ${textColor}`}>
          ${spent.toFixed(2)} <span className="text-[#717182] font-normal">/ ${budget.toFixed(2)}</span>
        </span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {rawPct > 100 && (
        <p className="text-[11px] text-red-500 mt-1">Over budget by ${(spent - budget).toFixed(2)}</p>
      )}
    </div>
  );
}

function ConfirmDialog({ message, onConfirm, onCancel }: { message: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4" onClick={onCancel}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
        <h3 className="text-[16px] font-semibold text-[#0a0a0a] mb-2">Confirm Delete</h3>
        <p className="text-[14px] text-[#717182] mb-5">{message}</p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 rounded-lg border border-[rgba(0,0,0,0.1)] text-[14px] font-medium text-[#0a0a0a] hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-lg bg-red-500 text-[14px] font-medium text-white hover:bg-red-600 transition-colors">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ContactDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    contacts, events, giftIdeas,
    updateContact, deleteContact,
    deleteEvent, updateGiftIdea, deleteGiftIdea,
    getContactEvents, getContactGiftIdeas, getEventGiftIdeas, getSpentForEvent,
  } = useApp();

  const contact = contacts.find(c => c.id === id);

  const [showEditContact, setShowEditContact] = useState(false);
  const [showAddIdea, setShowAddIdea] = useState(false);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [editingIdea, setEditingIdea] = useState<GiftIdea | null>(null);
  const [editingEvent, setEditingEvent] = useState<GiftEvent | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ type: 'contact' | 'idea' | 'event'; id: string } | null>(null);

  if (!contact) {
    return (
      <div className="min-h-screen bg-white pt-[60px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[18px] text-[#717182] mb-4">Contact not found</p>
          <button onClick={() => navigate('/contacts')} className="text-[14px] font-medium text-[#0a0a0a] underline">
            Back to Contacts
          </button>
        </div>
      </div>
    );
  }

  const contactEvents = getContactEvents(contact.id).sort((a, b) => a.date.localeCompare(b.date));
  const contactIdeas = getContactGiftIdeas(contact.id);

  const handleDeleteContact = () => {
    deleteContact(contact.id);
    navigate('/contacts');
  };

  const handleDeleteIdea = (ideaId: string) => {
    deleteGiftIdea(ideaId);
    setConfirmDelete(null);
  };

  const handleDeleteEvent = (eventId: string) => {
    deleteEvent(eventId);
    setConfirmDelete(null);
  };

  const handleStatusChange = (ideaId: string, status: GiftStatus) => {
    updateGiftIdea(ideaId, { status });
  };

  return (
    <div className="min-h-screen bg-[#fafafa] pt-[60px]">
      <div className="max-w-[860px] mx-auto px-6 py-8">

        {/* Back */}
        <button
          onClick={() => navigate('/contacts')}
          className="flex items-center gap-1.5 text-[14px] text-[#717182] hover:text-[#0a0a0a] transition-colors mb-6"
        >
          <ArrowLeft size={15} />
          Back to Contacts
        </button>

        {/* Contact Header Card */}
        <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.08)] shadow-[0_2px_12px_rgba(0,0,0,0.05)] p-6 mb-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="size-[56px] rounded-full bg-[#ececf0] flex items-center justify-center flex-shrink-0">
                <span className="text-[18px] font-medium text-[#717182]">{getInitials(contact.name)}</span>
              </div>
              <div>
                <h1 className="text-[24px] font-semibold text-[#0a0a0a]">{contact.name}</h1>
                <p className="text-[14px] text-[#717182]">{contact.relationship}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowEditContact(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[rgba(0,0,0,0.1)] text-[13px] font-medium text-[#0a0a0a] hover:bg-gray-50 transition-colors"
              >
                <Edit2 size={13} />
                Edit
              </button>
              <button
                onClick={() => setConfirmDelete({ type: 'contact', id: contact.id })}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-100 text-[13px] font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                <Trash2 size={13} />
                Delete
              </button>
            </div>
          </div>
          {(contact.email || contact.phone) && (
            <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-100">
              {contact.email && (
                <div className="flex items-center gap-2 text-[13px] text-[#717182]">
                  <Mail size={14} />
                  <a href={`mailto:${contact.email}`} className="hover:text-[#0a0a0a] transition-colors">{contact.email}</a>
                </div>
              )}
              {contact.phone && (
                <div className="flex items-center gap-2 text-[13px] text-[#717182]">
                  <Phone size={14} />
                  <a href={`tel:${contact.phone}`} className="hover:text-[#0a0a0a] transition-colors">{contact.phone}</a>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Gift Ideas Section */}
        <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.08)] shadow-[0_2px_12px_rgba(0,0,0,0.05)] mb-5 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gift size={18} className="text-[#717182]" />
              <h2 className="text-[17px] font-semibold text-[#0a0a0a]">Gift Ideas</h2>
              <span className="text-[12px] text-[#717182] bg-gray-100 rounded-full px-2 py-0.5">{contactIdeas.length}</span>
            </div>
            <button
              onClick={() => { setEditingIdea(null); setShowAddIdea(true); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0a0a0a] text-[13px] font-medium text-white hover:bg-[#333] transition-colors"
            >
              <Plus size={13} />
              Add Gift Idea
            </button>
          </div>

          {contactIdeas.length === 0 ? (
            <div className="p-8 text-center text-[#717182]">
              <Gift size={32} className="mx-auto mb-3 opacity-40" />
              <p className="text-[14px]">No gift ideas yet. Click "+ Add Gift Idea" to add one.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {contactIdeas.map(idea => {
                const linkedEvent = events.find(e => e.id === idea.eventId);
                return (
                  <div key={idea.id} className="px-6 py-4 hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[15px] font-medium text-[#0a0a0a]">{idea.name}</span>
                          <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${STATUS_BADGE[idea.status]}`}>
                            {idea.status}
                          </span>
                        </div>
                        {idea.description && (
                          <p className="text-[13px] text-[#717182] mt-0.5">{idea.description}</p>
                        )}
                        <div className="flex items-center gap-3 mt-2 flex-wrap">
                          <span className="text-[13px] font-medium text-[#0a0a0a]">${idea.price.toFixed(2)}</span>
                          {linkedEvent && (
                            <span className="text-[12px] text-[#717182] bg-gray-100 px-2 py-0.5 rounded-full">{linkedEvent.name}</span>
                          )}
                          {idea.url && (
                            <a
                              href={idea.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-[12px] text-blue-600 hover:underline"
                              onClick={e => e.stopPropagation()}
                            >
                              <ExternalLink size={11} />
                              View Link
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {/* Status dropdown */}
                        <select
                          value={idea.status}
                          onChange={e => handleStatusChange(idea.id, e.target.value as GiftStatus)}
                          className="text-[12px] border border-gray-200 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-black/10 cursor-pointer bg-white"
                          onClick={e => e.stopPropagation()}
                        >
                          <option value="Idea">Idea</option>
                          <option value="Purchased">Purchased</option>
                          <option value="Given">Given</option>
                        </select>
                        <button
                          onClick={() => { setEditingIdea(idea); setShowAddIdea(true); }}
                          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                          title="Edit gift idea"
                        >
                          <Edit2 size={13} className="text-[#717182]" />
                        </button>
                        <button
                          onClick={() => setConfirmDelete({ type: 'idea', id: idea.id })}
                          className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                          title="Delete gift idea"
                        >
                          <Trash2 size={13} className="text-red-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Events Section */}
        <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.08)] shadow-[0_2px_12px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-[#717182]" />
              <h2 className="text-[17px] font-semibold text-[#0a0a0a]">Events</h2>
              <span className="text-[12px] text-[#717182] bg-gray-100 rounded-full px-2 py-0.5">{contactEvents.length}</span>
            </div>
            <button
              onClick={() => { setEditingEvent(null); setShowAddEvent(true); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0a0a0a] text-[13px] font-medium text-white hover:bg-[#333] transition-colors"
            >
              <Plus size={13} />
              Add Event
            </button>
          </div>

          {contactEvents.length === 0 ? (
            <div className="p-8 text-center text-[#717182]">
              <Calendar size={32} className="mx-auto mb-3 opacity-40" />
              <p className="text-[14px]">No events linked. Click "+ Add Event" to add one.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {contactEvents.map(event => {
                const spent = getSpentForEvent(event.id);
                const ideaCount = getEventGiftIdeas(event.id).length;

                return (
                  <div key={event.id} className="px-6 py-4">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[15px] font-medium text-[#0a0a0a]">{event.name}</span>
                          <span className={`text-[11px] font-medium px-2 py-0.5 rounded-lg border ${EVENT_TYPE_BADGE[event.type]}`}>
                            {event.type}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <Calendar size={12} className="text-[#717182]" />
                          <span className="text-[13px] text-[#717182]">{formatDate(event.date)}</span>
                        </div>
                        {event.notes && (
                          <p className="text-[13px] text-[#717182] mt-1 italic">{event.notes}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          onClick={() => { setEditingEvent(event); setShowAddEvent(true); }}
                          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                          title="Edit event"
                        >
                          <Edit2 size={13} className="text-[#717182]" />
                        </button>
                        <button
                          onClick={() => setConfirmDelete({ type: 'event', id: event.id })}
                          className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                          title="Delete event"
                        >
                          <Trash2 size={13} className="text-red-400" />
                        </button>
                      </div>
                    </div>

                    {/* Budget tracker */}
                    <div className="bg-gray-50 rounded-xl p-4 mt-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[13px] font-medium text-[#0a0a0a]">Budget Tracker</span>
                        <span className="text-[12px] text-[#717182]">{ideaCount} gift idea{ideaCount !== 1 ? 's' : ''}</span>
                      </div>
                      <BudgetProgress spent={spent} budget={event.budget} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showEditContact && (
        <EditContactModal contact={contact} onClose={() => setShowEditContact(false)} />
      )}
      {showAddIdea && (
        <GiftIdeaModal
          contactId={contact.id}
          events={contactEvents}
          onClose={() => { setShowAddIdea(false); setEditingIdea(null); }}
          editIdea={editingIdea}
        />
      )}
      {showAddEvent && (
        <EventModal
          contactId={contact.id}
          onClose={() => { setShowAddEvent(false); setEditingEvent(null); }}
          editEvent={editingEvent}
        />
      )}
      {confirmDelete && (
        <ConfirmDialog
          message={
            confirmDelete.type === 'contact'
              ? `Are you sure you want to delete ${contact.name}? This will also remove all their gift ideas.`
              : confirmDelete.type === 'idea'
              ? 'Are you sure you want to delete this gift idea?'
              : 'Are you sure you want to delete this event? Gift ideas linked to it will be unlinked.'
          }
          onConfirm={() => {
            if (confirmDelete.type === 'contact') handleDeleteContact();
            else if (confirmDelete.type === 'idea') handleDeleteIdea(confirmDelete.id);
            else handleDeleteEvent(confirmDelete.id);
          }}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}

// Inline edit contact modal for contact detail page
function EditContactModal({ contact, onClose }: { contact: Contact; onClose: () => void }) {
  const { updateContact } = useApp();
  const [name, setName] = useState(contact.name);
  const [relationship, setRelationship] = useState(contact.relationship);
  const [email, setEmail] = useState(contact.email);
  const [phone, setPhone] = useState(contact.phone);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Name is required';
    if (!relationship.trim()) e.relationship = 'Relationship is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    updateContact(contact.id, { name: name.trim(), relationship: relationship.trim(), email: email.trim(), phone: phone.trim() });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-[20px] font-semibold text-[#0a0a0a]">Edit Contact</h2>
            <p className="text-[14px] text-[#717182] mt-0.5">Update contact information</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <X size={18} className="text-gray-500" />
          </button>
        </div>
        <div className="p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-medium text-[#0a0a0a]">Full Name</label>
            <input
              className="bg-[#f3f3f5] rounded-lg px-3 py-2 text-[14px] outline-none focus:ring-2 focus:ring-black/10 placeholder:text-[#717182]"
              value={name} onChange={e => setName(e.target.value)}
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-medium text-[#0a0a0a]">Relationship</label>
            <input
              className="bg-[#f3f3f5] rounded-lg px-3 py-2 text-[14px] outline-none focus:ring-2 focus:ring-black/10 placeholder:text-[#717182]"
              value={relationship} onChange={e => setRelationship(e.target.value)}
            />
            {errors.relationship && <p className="text-xs text-red-500">{errors.relationship}</p>}
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-medium text-[#0a0a0a]">Email Address</label>
            <input
              type="email"
              className="bg-[#f3f3f5] rounded-lg px-3 py-2 text-[14px] outline-none focus:ring-2 focus:ring-black/10 placeholder:text-[#717182]"
              value={email} onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-medium text-[#0a0a0a]">Phone Number</label>
            <input
              type="tel"
              className="bg-[#f3f3f5] rounded-lg px-3 py-2 text-[14px] outline-none focus:ring-2 focus:ring-black/10 placeholder:text-[#717182]"
              value={phone} onChange={e => setPhone(e.target.value)}
            />
          </div>
        </div>
        <div className="p-6 pt-0 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-[rgba(0,0,0,0.1)] text-[14px] font-medium text-[#0a0a0a] hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={handleSubmit} className="px-4 py-2 rounded-lg bg-[#0a0a0a] text-[14px] font-medium text-white hover:bg-[#333] transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
