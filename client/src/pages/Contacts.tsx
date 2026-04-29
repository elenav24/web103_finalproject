import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Calendar, DollarSign, Gift, Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import { useApp } from '../useApp';
import type { Contact } from '../store';
import './Contacts.css';

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function formatDate(date: string) {
  const d = new Date(date + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

interface ContactModalProps {
  onClose: () => void;
  editContact?: Contact | null;
}

function ContactModal({ onClose, editContact }: ContactModalProps) {
  const { addContact, updateContact } = useApp();
  const [name, setName] = useState(editContact?.name ?? '');
  const [relationship, setRelationship] = useState(editContact?.relationship ?? '');
  const [email, setEmail] = useState(editContact?.email ?? '');
  const [phone, setPhone] = useState(editContact?.phone ?? '');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Name is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const payload = { name: name.trim(), relationship: relationship.trim(), email: email.trim(), phone: phone.trim() };
      if (editContact) {
        await updateContact(editContact.id, payload);
        toast.success('Contact updated');
      } else {
        await addContact(payload);
        toast.success('Contact added');
      }
      onClose();
    } catch (err) {
      toast.error((err as Error).message ?? 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">{editContact ? 'Edit Contact' : 'Add New Contact'}</h2>
            <p className="modal-subtitle">Fill in the details to {editContact ? 'update' : 'add'} a contact</p>
          </div>
          <button className="modal-close" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Name</label>
            <input className="form-input" placeholder="e.g., Sarah Garcia" value={name} onChange={e => setName(e.target.value)} />
            {errors.name && <p className="form-error">{errors.name}</p>}
          </div>
          <div className="form-group">
            <label className="form-label">Relationship <span className="form-label-optional">(Optional)</span></label>
            <input className="form-input" placeholder="Mother, Best Friend, etc." value={relationship} onChange={e => setRelationship(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address <span className="form-label-optional">(Optional)</span></label>
            <input type="email" className="form-input" placeholder="email@example.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Phone Number <span className="form-label-optional">(Optional)</span></label>
            <input type="tel" className="form-input" placeholder="310-555-5555" value={phone} onChange={e => setPhone(e.target.value)} />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose} disabled={submitting}>Cancel</button>
          <button className="btn-primary" onClick={handleSubmit} disabled={submitting}>{submitting ? 'Saving…' : editContact ? 'Save Changes' : 'Add Contact'}</button>
        </div>
      </div>
    </div>
  );
}

export default function ContactsPage() {
  const navigate = useNavigate();
  const { contacts, eventTypes, getTotalBudgetForContact, getGiftIdeasCountForContact, getNextEventForContact, getContactEvents } = useApp();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="contacts-page">
      <div className="contacts-inner">
        <div className="contacts-header">
          <div>
            <h1 className="contacts-title">Contact Directory</h1>
            <p className="contacts-subtitle">Manage your gift recipients and never miss an important occasion</p>
          </div>
          <button className="btn-add" onClick={() => setShowModal(true)}>
            <Plus size={14} />
            Add Contact
          </button>
        </div>

        {contacts.length === 0 ? (
          <div className="contacts-empty">
            <p>No contacts yet</p>
            <p>Click "+ Add Contact" to add your first contact</p>
          </div>
        ) : (
          <div className="contacts-list">
            {contacts.map(contact => {
              const nextEvent = getNextEventForContact(contact.id);
              const allEvents = getContactEvents(contact.id);
              const totalBudget = getTotalBudgetForContact(contact.id);
              const giftCount = getGiftIdeasCountForContact(contact.id);
              const displayEvent = nextEvent ?? allEvents[0] ?? null;

              return (
                <div key={contact.id} className="contact-row" onClick={() => navigate(`/contacts/${contact.id}`)}>
                  <div className="contact-avatar">
                    <span>{getInitials(contact.name)}</span>
                  </div>

                  <div className="contact-name-col">
                    <p className="contact-name">{contact.name}</p>
                    <p className="contact-relationship">{contact.relationship}</p>
                  </div>

                  <div className="contact-event-col">
                    {displayEvent ? (
                      <div>
                        <div className="contact-event-name-row">
                          <Calendar size={13} color="#717182" />
                          <span className="contact-event-name">{displayEvent.name}</span>
                        </div>
                        <p className="contact-event-date">{formatDate(displayEvent.date)}</p>
                        {allEvents.length > 1 && (
                          <p className="contact-event-more">+{allEvents.length - 1} more</p>
                        )}
                      </div>
                    ) : (
                      <span className="contact-no-events">No events</span>
                    )}
                  </div>

                  <div className="contact-badge-col">
                    {displayEvent && (
                      <span
                        className="event-badge"
                        style={{ backgroundColor: eventTypes.find(t => t.id === displayEvent.type_id)?.color ?? '#94a3b8' }}
                      >
                        {displayEvent.type}
                      </span>
                    )}
                  </div>

                  <div className="contact-budget-col">
                    <div className="contact-budget-row">
                      <DollarSign size={14} />
                      <span className="contact-budget-amount">{totalBudget.toFixed(2)}</span>
                    </div>
                    <p className="contact-budget-label">Total budget</p>
                  </div>

                  <div className="contact-gifts-col">
                    <div className="contact-gifts-row">
                      <Gift size={14} color="#717182" />
                      <span className="contact-gifts-count">{giftCount}</span>
                    </div>
                    <p className="contact-gifts-label">Gift ideas</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showModal && <ContactModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
