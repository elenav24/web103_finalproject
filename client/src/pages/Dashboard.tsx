import { useState } from 'react';
import { Calendar, DollarSign, Users, Plus, X } from 'lucide-react';
import { useApp, EventType, GiftEvent } from '../store';

const EVENT_IMAGES: Record<EventType, string> = {
  Holiday: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
  Birthday: 'https://images.unsplash.com/photo-1664289597477-d5b2d266169d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
  Anniversary: 'https://images.unsplash.com/photo-1674129895589-a70302311f74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
  Custom: 'https://images.unsplash.com/photo-1651399973942-1721a0de0851?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
};


function CircularProgress({ percentage, size = 60 }: { percentage: number; size?: number }) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedPct = Math.min(percentage, 100);
  const offset = circumference - (clampedPct / 100) * circumference;
  const color = percentage > 100 ? '#ef4444' : percentage > 80 ? '#f59e0b' : '#00C950';

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90 absolute inset-0">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="#ECECF0" strokeWidth="6" fill="none" />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          stroke={color} strokeWidth="6" fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[11px] font-semibold text-[#0a0a0a]">{Math.round(percentage)}%</span>
      </div>
    </div>
  );
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function formatDate(date: string) {
  const d = new Date(date + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

interface EventModalProps {
  onClose: () => void;
  editEvent?: GiftEvent | null;
}

function EventModal({ onClose, editEvent }: EventModalProps) {
  const { contacts, addEvent, updateEvent } = useApp();
  const [name, setName] = useState(editEvent?.name ?? '');
  const [type, setType] = useState<EventType>(editEvent?.type ?? 'Holiday');
  const [date, setDate] = useState(editEvent?.date ?? '');
  const [budget, setBudget] = useState(editEvent ? String(editEvent.budget) : '');
  const [selectedContacts, setSelectedContacts] = useState<string[]>(editEvent?.contactIds ?? []);
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
    const payload = { name: name.trim(), type, date, budget: Number(budget), contactIds: selectedContacts, notes };
    if (editEvent) {
      updateEvent(editEvent.id, payload);
    } else {
      addEvent(payload);
    }
    onClose();
  };

  const toggleContact = (id: string) => {
    setSelectedContacts(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-[20px] font-semibold text-[#0a0a0a]">{editEvent ? 'Edit Event' : 'Create New Event'}</h2>
            <p className="text-[14px] text-[#717182] mt-0.5">Add a new gift-giving event to track and manage</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <X size={18} className="text-gray-500" />
          </button>
        </div>
        <div className="p-6 flex flex-col gap-5">
          {/* Event Name */}
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-medium text-[#0a0a0a]">Event Name</label>
            <input
              className="bg-[#f3f3f5] rounded-lg px-3 py-2 text-[14px] outline-none focus:ring-2 focus:ring-black/10 placeholder:text-[#717182]"
              placeholder="e.g., Mom's Birthday, Christmas 2026"
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
              <label className="text-[14px] font-medium text-[#0a0a0a]">Event Date</label>
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
                type="number"
                min="0"
                step="0.01"
                className="bg-[#f3f3f5] rounded-lg pl-7 pr-3 py-2 text-[14px] outline-none focus:ring-2 focus:ring-black/10 w-full"
                placeholder="0.00"
                value={budget} onChange={e => setBudget(e.target.value)}
              />
            </div>
            {errors.budget && <p className="text-xs text-red-500">{errors.budget}</p>}
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-medium text-[#0a0a0a]">Gift Recipients</label>
            <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-lg p-3 flex flex-wrap gap-2 min-h-[44px]">
              {contacts.map(c => (
                <button
                  key={c.id}
                  onClick={() => toggleContact(c.id)}
                  className={`px-3 py-1 rounded-full text-[12px] font-medium transition-colors border ${selectedContacts.includes(c.id) ? 'bg-[#0a0a0a] text-white border-[#0a0a0a]' : 'bg-white text-[#717182] border-gray-200 hover:border-gray-400'}`}
                >
                  {c.name}
                </button>
              ))}
              {contacts.length === 0 && <span className="text-[14px] text-[#717182]">No contacts yet</span>}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-medium text-[#0a0a0a]">Notes (Optional)</label>
            <textarea
              className="bg-[#f3f3f5] rounded-lg px-3 py-2 text-[14px] outline-none focus:ring-2 focus:ring-black/10 resize-none placeholder:text-[#717182]"
              placeholder="Add any additional notes or gift ideas..."
              rows={3}
              value={notes} onChange={e => setNotes(e.target.value)}
            />
          </div>
        </div>
        <div className="p-6 pt-0 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-[rgba(0,0,0,0.1)] text-[14px] font-medium text-[#0a0a0a] hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={handleSubmit} className="px-4 py-2 rounded-lg bg-[#0a0a0a] text-[14px] font-medium text-white hover:bg-[#333] transition-colors">
            {editEvent ? 'Save Changes' : 'Create Event'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { events, contacts, getSpentForEvent } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<GiftEvent | null>(null);

  const sortedEvents = [...events].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="min-h-screen bg-white pt-[60px]">
      <div className="max-w-[1200px] mx-auto px-8 py-10">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-[30px] font-medium text-[#0a0a0a] tracking-tight">Event Dashboard</h1>
            <p className="text-[16px] text-[#717182] mt-1">Track your upcoming gift-giving events and stay within budget</p>
          </div>
          <button
            onClick={() => { setEditingEvent(null); setShowModal(true); }}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#0a0a0a] text-[14px] font-medium text-[#0a0a0a] hover:bg-[#0a0a0a] hover:text-white transition-all"
          >
            <Plus size={14} />
            Add Event
          </button>
        </div>

        {sortedEvents.length === 0 ? (
          <div className="text-center py-20 text-[#717182]">
            <p className="text-[18px] mb-2">No events yet</p>
            <p className="text-[14px]">Click "+ Add Event" to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {sortedEvents.map(event => {
              const spent = getSpentForEvent(event.id);
              const pct = event.budget > 0 ? (spent / event.budget) * 100 : 0;
              const eventContacts = contacts.filter(c => event.contactIds.includes(c.id));
              const shown = eventContacts.slice(0, 2);
              const extra = eventContacts.length - shown.length;

              return (
                <div
                  key={event.id}
                  className="bg-white rounded-2xl border border-[rgba(0,0,0,0.08)] shadow-[0_2px_12px_rgba(0,0,0,0.06)] overflow-hidden cursor-pointer hover:shadow-[0_4px_20px_rgba(0,0,0,0.12)] transition-shadow"
                  onClick={() => { setEditingEvent(event); setShowModal(true); }}
                >
                  <div className="relative h-[110px] overflow-hidden">
                    <img src={EVENT_IMAGES[event.type]} alt={event.type} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <span className="absolute top-3 right-3 bg-white/90 text-[#0a0a0a] text-[11px] font-medium px-2 py-0.5 rounded-lg">
                      {event.type}
                    </span>
                  </div>

                  <div className="p-5 flex flex-col gap-3">
                    {/* Title row */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[16px] font-medium text-[#0a0a0a] truncate">{event.name}</h3>
                        <div className="flex items-center gap-1.5 mt-1">
                          <Calendar size={13} className="text-[#717182] flex-shrink-0" />
                          <span className="text-[13px] text-[#717182]">{formatDate(event.date)}</span>
                        </div>
                      </div>
                      <CircularProgress percentage={pct} size={56} />
                    </div>

                    <div className="border-t border-gray-100 pt-3 flex flex-col gap-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <DollarSign size={14} className="text-[#717182]" />
                          <span className="text-[13px] text-[#717182]">Budget</span>
                        </div>
                        <span className="text-[13px] font-medium">
                          <span className={spent > event.budget ? 'text-red-500' : spent / event.budget >= 0.8 ? 'text-amber-500' : 'text-[#00a63e]'}>
                            ${spent.toFixed(2)}
                          </span>
                          <span className="text-[#717182]"> / ${event.budget.toFixed(2)}</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Users size={14} className="text-[#717182]" />
                        <span className="text-[13px] text-[#717182]">Contacts</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {shown.map(c => (
                          <span key={c.id} className="flex items-center gap-1.5 bg-[#ececf0] rounded-full px-2 py-0.5">
                            <span className="size-5 rounded-full bg-[#d4d4d8] flex items-center justify-center text-[9px] font-medium text-[#0a0a0a]">
                              {getInitials(c.name)}
                            </span>
                            <span className="text-[12px] text-[#0a0a0a]">{c.name}</span>
                          </span>
                        ))}
                        {extra > 0 && (
                          <span className="bg-[#eceef2] text-[#030213] text-[11px] font-medium px-2 py-0.5 rounded-lg">
                            +{extra} more
                          </span>
                        )}
                        {eventContacts.length === 0 && (
                          <span className="text-[13px] text-[#717182]">No recipients</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showModal && (
        <EventModal
          onClose={() => { setShowModal(false); setEditingEvent(null); }}
          editEvent={editingEvent}
        />
      )}
    </div>
  );
}
