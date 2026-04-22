import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Edit2, Trash2, Plus, X, ExternalLink, Calendar, DollarSign, Gift, Mail, Phone } from 'lucide-react';
import { useApp, Contact, GiftEvent, GiftIdea, GiftStatus, EventType } from '../store';
import './ContactDetail.css';

const STATUS_CLASS: Record<GiftStatus, string> = {
  Idea: 'idea',
  Purchased: 'purchased',
  Given: 'given',
};

const EVENT_TYPE_CLASS: Record<EventType, string> = {
  Birthday: 'birthday',
  Holiday: 'holiday',
  Anniversary: 'anniversary',
  Custom: 'custom',
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
    if (editIdea) { updateGiftIdea(editIdea.id, payload); } else { addGiftIdea(payload); }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">{editIdea ? 'Edit Gift Idea' : 'Add Gift Idea'}</h2>
            <p className="modal-subtitle">Track a gift you'd like to give</p>
          </div>
          <button className="modal-close" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Gift Name</label>
            <input className="form-input" placeholder="e.g., Wireless Headphones" value={name} onChange={e => setName(e.target.value)} />
            {errors.name && <p className="form-error">{errors.name}</p>}
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-textarea" placeholder="Brief description of the gift..." rows={2} value={description} onChange={e => setDescription(e.target.value)} />
          </div>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Price Estimate</label>
              <div className="form-input-prefix">
                <span className="form-input-prefix-symbol">$</span>
                <input type="number" min="0" step="0.01" className="form-input" placeholder="0.00" value={price} onChange={e => setPrice(e.target.value)} />
              </div>
              {errors.price && <p className="form-error">{errors.price}</p>}
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-select" value={status} onChange={e => setStatus(e.target.value as GiftStatus)}>
                <option value="Idea">Idea</option>
                <option value="Purchased">Purchased</option>
                <option value="Given">Given</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Product URL (Optional)</label>
            <input type="url" className="form-input" placeholder="https://..." value={url} onChange={e => setUrl(e.target.value)} />
          </div>
          {events.length > 0 && (
            <div className="form-group">
              <label className="form-label">Link to Event</label>
              <select className="form-select" value={eventId} onChange={e => setEventId(e.target.value)}>
                <option value="">— No event —</option>
                {events.map(ev => <option key={ev.id} value={ev.id}>{ev.name}</option>)}
              </select>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSubmit}>{editIdea ? 'Save Changes' : 'Add Gift Idea'}</button>
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
  const { addEvent, updateEvent } = useApp();
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
    if (editEvent) { updateEvent(editEvent.id, payload); } else { addEvent(payload); }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">{editEvent ? 'Edit Event' : 'Add Event'}</h2>
            <p className="modal-subtitle">Track an event for this contact</p>
          </div>
          <button className="modal-close" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Event Name</label>
            <input className="form-input" placeholder="e.g., Mom's Birthday" value={name} onChange={e => setName(e.target.value)} />
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
              <label className="form-label">Date</label>
              <input type="date" className="form-input-date" value={date} onChange={e => setDate(e.target.value)} />
              {errors.date && <p className="form-error">{errors.date}</p>}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Total Budget</label>
            <div className="form-input-prefix">
              <span className="form-input-prefix-symbol">$</span>
              <input type="number" min="0" step="0.01" className="form-input" placeholder="0.00" value={budget} onChange={e => setBudget(e.target.value)} />
            </div>
            {errors.budget && <p className="form-error">{errors.budget}</p>}
          </div>
          <div className="form-group">
            <label className="form-label">Notes (Optional)</label>
            <textarea className="form-textarea" placeholder="Any notes about this event..." rows={2} value={notes} onChange={e => setNotes(e.target.value)} />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSubmit}>{editEvent ? 'Save Changes' : 'Add Event'}</button>
        </div>
      </div>
    </div>
  );
}

interface EditContactModalProps {
  contact: Contact;
  onClose: () => void;
}

function EditContactModal({ contact, onClose }: EditContactModalProps) {
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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Edit Contact</h2>
            <p className="modal-subtitle">Update contact details</p>
          </div>
          <button className="modal-close" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" value={name} onChange={e => setName(e.target.value)} />
            {errors.name && <p className="form-error">{errors.name}</p>}
          </div>
          <div className="form-group">
            <label className="form-label">Relationship</label>
            <input className="form-input" value={relationship} onChange={e => setRelationship(e.target.value)} />
            {errors.relationship && <p className="form-error">{errors.relationship}</p>}
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" className="form-input" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Phone</label>
            <input type="tel" className="form-input" value={phone} onChange={e => setPhone(e.target.value)} />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSubmit}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}

function BudgetProgress({ spent, budget }: { spent: number; budget: number }) {
  const pct = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;
  const rawPct = budget > 0 ? (spent / budget) * 100 : 0;
  const cls = rawPct > 100 ? 'over' : rawPct >= 80 ? 'warning' : 'ok';

  return (
    <div>
      <div className="budget-used-row">
        <span className="budget-used-label">Budget Used</span>
        <span className={`budget-used-value ${cls}`}>
          ${spent.toFixed(2)} <span className="budget-used-total">/ ${budget.toFixed(2)}</span>
        </span>
      </div>
      <div className="budget-bar-track">
        <div className={`budget-bar-fill ${cls}`} style={{ width: `${pct}%` }} />
      </div>
      {rawPct > 100 && <p className="budget-over-msg">Over budget by ${(spent - budget).toFixed(2)}</p>}
    </div>
  );
}

function ConfirmDialog({ message, onConfirm, onCancel }: { message: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="confirm-overlay" onClick={onCancel}>
      <div className="confirm-box" onClick={e => e.stopPropagation()}>
        <h3 className="confirm-title">Confirm Delete</h3>
        <p className="confirm-message">{message}</p>
        <div className="confirm-actions">
          <button className="btn-cancel" onClick={onCancel}>Cancel</button>
          <button className="btn-danger" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

export default function ContactDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { contacts, events, deleteContact, deleteEvent, updateGiftIdea, deleteGiftIdea, getContactEvents, getContactGiftIdeas, getEventGiftIdeas, getSpentForEvent } = useApp();

  const contact = contacts.find(c => c.id === id);
  const [showEditContact, setShowEditContact] = useState(false);
  const [showAddIdea, setShowAddIdea] = useState(false);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [editingIdea, setEditingIdea] = useState<GiftIdea | null>(null);
  const [editingEvent, setEditingEvent] = useState<GiftEvent | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ type: 'contact' | 'idea' | 'event'; id: string } | null>(null);

  if (!contact) {
    return (
      <div className="detail-not-found">
        <div className="detail-not-found-inner">
          <p>Contact not found</p>
          <button onClick={() => navigate('/contacts')}>Back to Contacts</button>
        </div>
      </div>
    );
  }

  const contactEvents = getContactEvents(contact.id).sort((a, b) => a.date.localeCompare(b.date));
  const contactIdeas = getContactGiftIdeas(contact.id);

  const handleDeleteContact = () => { deleteContact(contact.id); navigate('/contacts'); };
  const handleDeleteIdea = (ideaId: string) => { deleteGiftIdea(ideaId); setConfirmDelete(null); };
  const handleDeleteEvent = (eventId: string) => { deleteEvent(eventId); setConfirmDelete(null); };
  const handleStatusChange = (ideaId: string, status: GiftStatus) => updateGiftIdea(ideaId, { status });

  return (
    <div className="detail-page">
      <div className="detail-inner">
        <button className="detail-back" onClick={() => navigate('/contacts')}>
          <ArrowLeft size={15} />
          Back to Contacts
        </button>

        <div className="detail-card">
          <div className="detail-contact-header">
            <div className="detail-contact-info">
              <div className="detail-avatar"><span>{getInitials(contact.name)}</span></div>
              <div>
                <h1 className="detail-contact-name">{contact.name}</h1>
                <p className="detail-contact-rel">{contact.relationship}</p>
              </div>
            </div>
            <div className="detail-contact-actions">
              <button className="btn-edit" onClick={() => setShowEditContact(true)}>
                <Edit2 size={13} /> Edit
              </button>
              <button className="btn-delete" onClick={() => setConfirmDelete({ type: 'contact', id: contact.id })}>
                <Trash2 size={13} /> Delete
              </button>
            </div>
          </div>
          {(contact.email || contact.phone) && (
            <div className="detail-contact-meta">
              {contact.email && (
                <div className="detail-meta-item">
                  <Mail size={14} />
                  <a href={`mailto:${contact.email}`}>{contact.email}</a>
                </div>
              )}
              {contact.phone && (
                <div className="detail-meta-item">
                  <Phone size={14} />
                  <a href={`tel:${contact.phone}`}>{contact.phone}</a>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="section-card">
          <div className="section-header">
            <div className="section-title-row">
              <Gift size={18} color="#717182" />
              <h2 className="section-title">Gift Ideas</h2>
              <span className="section-count">{contactIdeas.length}</span>
            </div>
            <button className="btn-section-add" onClick={() => { setEditingIdea(null); setShowAddIdea(true); }}>
              <Plus size={13} /> Add Gift Idea
            </button>
          </div>
          {contactIdeas.length === 0 ? (
            <div className="section-empty">
              <Gift size={32} color="#d1d5db" />
              <p>No gift ideas yet. Click "+ Add Gift Idea" to add one.</p>
            </div>
          ) : (
            <div>
              {contactIdeas.map(idea => {
                const linkedEvent = events.find(e => e.id === idea.eventId);
                return (
                  <div key={idea.id} className="idea-row">
                    <div className="idea-row-inner">
                      <div className="idea-content">
                        <div className="idea-name-row">
                          <span className="idea-name">{idea.name}</span>
                          <span className={`status-badge ${STATUS_CLASS[idea.status]}`}>{idea.status}</span>
                        </div>
                        {idea.description && <p className="idea-description">{idea.description}</p>}
                        <div className="idea-meta">
                          <span className="idea-price">${idea.price.toFixed(2)}</span>
                          {linkedEvent && <span className="idea-event-tag">{linkedEvent.name}</span>}
                          {idea.url && (
                            <a href={idea.url} target="_blank" rel="noopener noreferrer" className="idea-link" onClick={e => e.stopPropagation()}>
                              <ExternalLink size={11} /> View Link
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="idea-actions">
                        <select className="status-select" value={idea.status} onChange={e => handleStatusChange(idea.id, e.target.value as GiftStatus)} onClick={e => e.stopPropagation()}>
                          <option value="Idea">Idea</option>
                          <option value="Purchased">Purchased</option>
                          <option value="Given">Given</option>
                        </select>
                        <button className="btn-icon" onClick={() => { setEditingIdea(idea); setShowAddIdea(true); }}>
                          <Edit2 size={13} color="#717182" />
                        </button>
                        <button className="btn-icon danger" onClick={() => setConfirmDelete({ type: 'idea', id: idea.id })}>
                          <Trash2 size={13} color="#f87171" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="section-card">
          <div className="section-header">
            <div className="section-title-row">
              <Calendar size={18} color="#717182" />
              <h2 className="section-title">Events</h2>
              <span className="section-count">{contactEvents.length}</span>
            </div>
            <button className="btn-section-add" onClick={() => { setEditingEvent(null); setShowAddEvent(true); }}>
              <Plus size={13} /> Add Event
            </button>
          </div>
          {contactEvents.length === 0 ? (
            <div className="section-empty">
              <Calendar size={32} color="#d1d5db" />
              <p>No events linked. Click "+ Add Event" to add one.</p>
            </div>
          ) : (
            <div>
              {contactEvents.map(event => {
                const spent = getSpentForEvent(event.id);
                const ideaCount = getEventGiftIdeas(event.id).length;
                return (
                  <div key={event.id} className="event-row">
                    <div className="event-row-header">
                      <div className="event-row-info">
                        <div className="event-row-name-row">
                          <span className="event-row-name">{event.name}</span>
                          <span className={`event-type-badge ${EVENT_TYPE_CLASS[event.type]}`}>{event.type}</span>
                        </div>
                        <div className="event-row-date">
                          <Calendar size={12} color="#717182" />
                          <span>{formatDate(event.date)}</span>
                        </div>
                        {event.notes && <p className="event-row-notes">{event.notes}</p>}
                      </div>
                      <div className="idea-actions">
                        <button className="btn-icon" onClick={() => { setEditingEvent(event); setShowAddEvent(true); }}>
                          <Edit2 size={13} color="#717182" />
                        </button>
                        <button className="btn-icon danger" onClick={() => setConfirmDelete({ type: 'event', id: event.id })}>
                          <Trash2 size={13} color="#f87171" />
                        </button>
                      </div>
                    </div>
                    <div className="budget-tracker">
                      <div className="budget-tracker-header">
                        <span className="budget-tracker-title">Budget Tracker</span>
                        <span className="budget-tracker-count">{ideaCount} gift idea{ideaCount !== 1 ? 's' : ''}</span>
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

      {showEditContact && <EditContactModal contact={contact} onClose={() => setShowEditContact(false)} />}
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
              ? `Delete ${contact.name}? This will also remove all their gift ideas.`
              : confirmDelete.type === 'idea'
              ? 'Delete this gift idea?'
              : 'Delete this event?'
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
