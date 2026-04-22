import { useState } from 'react';
import { Calendar, DollarSign, Users, Plus, X } from 'lucide-react';
import { useApp, EventType, GiftEvent } from '../store';
import './Dashboard.css';

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
    <div className="circular-progress" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="#ECECF0" strokeWidth="6" fill="none" />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          stroke={color} strokeWidth="6" fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="circular-progress-label">
        <span>{Math.round(percentage)}%</span>
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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">{editEvent ? 'Edit Event' : 'Create New Event'}</h2>
            <p className="modal-subtitle">Add a new gift-giving event to track and manage</p>
          </div>
          <button className="modal-close" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Event Name</label>
            <input
              className="form-input"
              placeholder="e.g., Mom's Birthday, Christmas 2026"
              value={name} onChange={e => setName(e.target.value)}
            />
            {errors.name && <p className="form-error">{errors.name}</p>}
          </div>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Event Type</label>
              <select className="form-select" value={type} onChange={e => setType(e.target.value as EventType)}>
                <option value="Birthday">Birthday</option>
                <option value="Holiday">Holiday</option>
                <option value="Anniversary">Anniversary</option>
                <option value="Custom">Custom</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Event Date</label>
              <input
                type="date"
                className="form-input-date"
                value={date} onChange={e => setDate(e.target.value)}
              />
              {errors.date && <p className="form-error">{errors.date}</p>}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Total Budget</label>
            <div className="form-input-prefix">
              <span className="form-input-prefix-symbol">$</span>
              <input
                type="number" min="0" step="0.01"
                className="form-input"
                placeholder="0.00"
                value={budget} onChange={e => setBudget(e.target.value)}
              />
            </div>
            {errors.budget && <p className="form-error">{errors.budget}</p>}
          </div>
          <div className="form-group">
            <label className="form-label">Gift Recipients</label>
            <div className="recipient-picker">
              {contacts.map(c => (
                <button
                  key={c.id}
                  onClick={() => toggleContact(c.id)}
                  className={`recipient-btn${selectedContacts.includes(c.id) ? ' selected' : ''}`}
                >
                  {c.name}
                </button>
              ))}
              {contacts.length === 0 && <span style={{ fontSize: 14, color: '#717182' }}>No contacts yet</span>}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Notes (Optional)</label>
            <textarea
              className="form-textarea"
              placeholder="Add any additional notes or gift ideas..."
              rows={3}
              value={notes} onChange={e => setNotes(e.target.value)}
            />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSubmit}>
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
    <div className="dashboard-page">
      <div className="dashboard-inner">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Event Dashboard</h1>
            <p className="dashboard-subtitle">Track your upcoming gift-giving events and stay within budget</p>
          </div>
          <button className="btn-add" onClick={() => { setEditingEvent(null); setShowModal(true); }}>
            <Plus size={14} />
            Add Event
          </button>
        </div>

        {sortedEvents.length === 0 ? (
          <div className="dashboard-empty">
            <p>No events yet</p>
            <p>Click "+ Add Event" to get started</p>
          </div>
        ) : (
          <div className="event-grid">
            {sortedEvents.map(event => {
              const spent = getSpentForEvent(event.id);
              const pct = event.budget > 0 ? (spent / event.budget) * 100 : 0;
              const eventContacts = contacts.filter(c => event.contactIds.includes(c.id));
              const shown = eventContacts.slice(0, 2);
              const extra = eventContacts.length - shown.length;
              const spentClass = spent > event.budget ? 'over' : spent / event.budget >= 0.8 ? 'warning' : '';

              return (
                <div
                  key={event.id}
                  className="event-card"
                  onClick={() => { setEditingEvent(event); setShowModal(true); }}
                >
                  <div className="event-card-image">
                    <img src={EVENT_IMAGES[event.type]} alt={event.type} />
                    <div className="event-card-image-overlay" />
                    <span className="event-type-badge">{event.type}</span>
                  </div>
                  <div className="event-card-body">
                    <div className="event-card-title-row">
                      <div className="event-card-title-wrap">
                        <h3 className="event-card-name">{event.name}</h3>
                        <div className="event-card-date">
                          <Calendar size={13} />
                          <span>{formatDate(event.date)}</span>
                        </div>
                      </div>
                      <CircularProgress percentage={pct} size={56} />
                    </div>
                    <div className="event-card-stats">
                      <div className="event-stat-row">
                        <div className="event-stat-label">
                          <DollarSign size={14} />
                          <span>Budget</span>
                        </div>
                        <span className="event-stat-value">
                          <span className={`budget-spent${spentClass ? ` ${spentClass}` : ''}`}>${spent.toFixed(2)}</span>
                          <span className="budget-total"> / ${event.budget.toFixed(2)}</span>
                        </span>
                      </div>
                      <div className="event-stat-label">
                        <Users size={14} />
                        <span>Contacts</span>
                      </div>
                      <div className="contact-chips">
                        {shown.map(c => (
                          <span key={c.id} className="contact-chip">
                            <span className="contact-chip-avatar">{getInitials(c.name)}</span>
                            <span className="contact-chip-name">{c.name}</span>
                          </span>
                        ))}
                        {extra > 0 && <span className="contact-chip-more">+{extra} more</span>}
                        {eventContacts.length === 0 && <span style={{ fontSize: 13, color: '#717182' }}>No recipients</span>}
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
