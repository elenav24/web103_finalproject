import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Calendar, DollarSign, Gift, Plus, X } from 'lucide-react';
import { useApp, Contact, EventType } from '../store';

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

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Name is required';
    if (!relationship.trim()) e.relationship = 'Relationship is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const payload = { name: name.trim(), relationship: relationship.trim(), email: email.trim(), phone: phone.trim() };
    if (editContact) {
      updateContact(editContact.id, payload);
    } else {
      addContact(payload);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-[20px] font-semibold text-[#0a0a0a]">{editContact ? 'Edit Contact' : 'Add New Contact'}</h2>
            <p className="text-[14px] text-[#717182] mt-0.5">Fill in the details to {editContact ? 'update' : 'add'} a contact</p>
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
              placeholder="e.g., Sarah Johnson"
              value={name} onChange={e => setName(e.target.value)}
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-medium text-[#0a0a0a]">Relationship</label>
            <input
              className="bg-[#f3f3f5] rounded-lg px-3 py-2 text-[14px] outline-none focus:ring-2 focus:ring-black/10 placeholder:text-[#717182]"
              placeholder="e.g., Mother, Best Friend, Colleague"
              value={relationship} onChange={e => setRelationship(e.target.value)}
            />
            {errors.relationship && <p className="text-xs text-red-500">{errors.relationship}</p>}
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-medium text-[#0a0a0a]">Email Address</label>
            <input
              type="email"
              className="bg-[#f3f3f5] rounded-lg px-3 py-2 text-[14px] outline-none focus:ring-2 focus:ring-black/10 placeholder:text-[#717182]"
              placeholder="email@example.com"
              value={email} onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-medium text-[#0a0a0a]">Phone Number</label>
            <input
              type="tel"
              className="bg-[#f3f3f5] rounded-lg px-3 py-2 text-[14px] outline-none focus:ring-2 focus:ring-black/10 placeholder:text-[#717182]"
              placeholder="555-0100"
              value={phone} onChange={e => setPhone(e.target.value)}
            />
          </div>
        </div>
        <div className="p-6 pt-0 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-[rgba(0,0,0,0.1)] text-[14px] font-medium text-[#0a0a0a] hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={handleSubmit} className="px-4 py-2 rounded-lg bg-[#0a0a0a] text-[14px] font-medium text-white hover:bg-[#333] transition-colors">
            {editContact ? 'Save Changes' : 'Add Contact'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ContactsPage() {
  const navigate = useNavigate();
  const { contacts, getTotalBudgetForContact, getGiftIdeasCountForContact, getNextEventForContact, getContactEvents } = useApp();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen bg-white pt-[60px]">
      <div className="max-w-[1100px] mx-auto px-8 py-10">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-[30px] font-medium text-[#0a0a0a] tracking-tight">Contact Directory</h1>
            <p className="text-[16px] text-[#717182] mt-1">Manage your gift recipients and never miss an important occasion</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#0a0a0a] text-[14px] font-medium text-[#0a0a0a] hover:bg-[#0a0a0a] hover:text-white transition-all"
          >
            <Plus size={14} />
            Add Contact
          </button>
        </div>

        {contacts.length === 0 ? (
          <div className="text-center py-20 text-[#717182]">
            <p className="text-[18px] mb-2">No contacts yet</p>
            <p className="text-[14px]">Click "+ Add Contact" to add your first contact</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.08)] shadow-[0_2px_12px_rgba(0,0,0,0.05)] overflow-hidden">
            {contacts.map((contact, idx) => {
              const nextEvent = getNextEventForContact(contact.id);
              const allEvents = getContactEvents(contact.id);
              const totalBudget = getTotalBudgetForContact(contact.id);
              const giftCount = getGiftIdeasCountForContact(contact.id);
              const avatar = null;

              return (
                <div
                  key={contact.id}
                  className={`flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-[#fafafa] transition-colors ${idx < contacts.length - 1 ? 'border-b border-[rgba(0,0,0,0.06)]' : ''}`}
                  onClick={() => navigate(`/contacts/${contact.id}`)}
                >
                  <div className="size-[44px] rounded-full overflow-hidden flex-shrink-0 bg-[#ececf0] flex items-center justify-center">
                    {avatar ? (
                      <img src={avatar} alt={contact.name} className="size-full object-cover" />
                    ) : (
                      <span className="text-[14px] font-medium text-[#717182]">{getInitials(contact.name)}</span>
                    )}
                  </div>

                  {/* Name + relationship */}
                  <div className="w-[160px] flex-shrink-0">
                    <p className="text-[15px] font-medium text-[#0a0a0a]">{contact.name}</p>
                    <p className="text-[13px] text-[#717182]">{contact.relationship}</p>
                  </div>

                  {/* Next Event */}
                  <div className="flex-1 min-w-0">
                    {nextEvent ? (
                      <div>
                        <div className="flex items-center gap-1.5">
                          <Calendar size={13} className="text-[#717182] flex-shrink-0" />
                          <span className="text-[13px] font-medium text-[#0a0a0a] truncate">{nextEvent.name}</span>
                        </div>
                        <p className="text-[12px] text-[#717182] mt-0.5 pl-5">{formatDate(nextEvent.date)}</p>
                        {allEvents.length > 1 && (
                          <p className="text-[12px] text-[#717182] pl-5">+{allEvents.length - 1} more</p>
                        )}
                      </div>
                    ) : allEvents.length > 0 ? (
                      <div>
                        <div className="flex items-center gap-1.5">
                          <Calendar size={13} className="text-[#717182] flex-shrink-0" />
                          <span className="text-[13px] font-medium text-[#0a0a0a] truncate">{allEvents[0].name}</span>
                        </div>
                        <p className="text-[12px] text-[#717182] mt-0.5 pl-5">{formatDate(allEvents[0].date)}</p>
                        {allEvents.length > 1 && (
                          <p className="text-[12px] text-[#717182] pl-5">+{allEvents.length - 1} more</p>
                        )}
                      </div>
                    ) : (
                      <span className="text-[13px] text-[#b0b0b8]">No events</span>
                    )}
                  </div>

                  {/* Event type badge */}
                  <div className="w-[110px] flex-shrink-0 flex justify-center">
                    {(nextEvent || allEvents[0]) && (
                      <span className={`inline-block px-2.5 py-0.5 rounded-lg text-[12px] font-medium border ${EVENT_TYPE_BADGE[(nextEvent || allEvents[0])!.type]}`}>
                        {(nextEvent || allEvents[0])!.type}
                      </span>
                    )}
                  </div>

                  {/* Budget */}
                  <div className="w-[130px] flex-shrink-0">
                    <div className="flex items-center gap-1 text-[#717182]">
                      <DollarSign size={14} />
                      <span className="text-[15px] font-medium text-[#0a0a0a]">${totalBudget.toFixed(2)}</span>
                    </div>
                    <p className="text-[12px] text-[#717182] pl-5">Total budget</p>
                  </div>

                  {/* Gift Ideas count */}
                  <div className="w-[90px] flex-shrink-0 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Gift size={14} className="text-[#717182]" />
                      <span className="text-[15px] font-medium text-[#0a0a0a]">{giftCount}</span>
                    </div>
                    <p className="text-[12px] text-[#717182]">Gift ideas</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showModal && (
        <ContactModal onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}
