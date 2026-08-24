import { useState, createContext, useContext, type ReactNode } from 'react';
import { useMembershipPlans } from '../lib/useMembershipPlans';
import { supabase } from '../lib/supabase';

// Site-wide popup — sampled from the "Membership Signup" firebox popup that
// appears on every page of efn.co.ke. Fields exactly as on the live form:
// Choose Plan (dropdown), First Name, Email, Phone Number.

interface ModalContextValue {
  open: (planId?: string) => void;
}
const ModalContext = createContext<ModalContextValue | null>(null);

export function useMembershipModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error('useMembershipModal must be used within MembershipModalProvider');
  return ctx;
}

export function MembershipModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [preselectedPlan, setPreselectedPlan] = useState<string | undefined>();

  const open = (planId?: string) => {
    setPreselectedPlan(planId);
    setIsOpen(true);
  };

  return (
    <ModalContext.Provider value={{ open }}>
      {children}
      {isOpen && (
        <MembershipModal
          initialPlan={preselectedPlan}
          onClose={() => setIsOpen(false)}
        />
      )}
    </ModalContext.Provider>
  );
}

function MembershipModal({ initialPlan, onClose }: { initialPlan?: string; onClose: () => void }) {
  const { plans: membershipPlans } = useMembershipPlans();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    const form = new FormData(e.currentTarget);

    const { error } = await supabase.from('membership_signups').insert({
      plan_id: String(form.get('plan')),
      first_name: String(form.get('firstName')),
      email: String(form.get('email')),
      phone: String(form.get('phone')),
    });

    if (error) {
      setError('Could not submit — please try again, or reach us on the Contacts page.');
      setSubmitting(false);
      return;
    }

    setSubmitted(true);
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div
        className="bg-efn-white max-w-md w-full p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 text-2xl leading-none hover:text-efn-green"
        >
          ×
        </button>
        <h3 className="text-2xl mb-6">Membership Signup</h3>

        {submitted ? (
          <p>Thanks! We'll be in touch shortly to confirm your membership.</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="block text-sm mb-1">Choose Plan</span>
              <select
                name="plan"
                defaultValue={initialPlan ?? ''}
                required
                className="w-full border border-efn-gray px-4 py-3"
              >
                <option value="" disabled>- Select -</option>
                {membershipPlans.map((plan) => (
                  <option key={plan.id} value={plan.id}>{plan.name}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="block text-sm mb-1">First Name</span>
              <input name="firstName" required className="w-full border border-efn-gray px-4 py-3" />
            </label>
            <label className="block">
              <span className="block text-sm mb-1">Email</span>
              <input type="email" name="email" required className="w-full border border-efn-gray px-4 py-3" />
            </label>
            <label className="block">
              <span className="block text-sm mb-1">Phone Number</span>
              <input type="tel" name="phone" required className="w-full border border-efn-gray px-4 py-3" />
            </label>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button type="submit" disabled={submitting} className="btn-solid w-full text-center">
              {submitting ? '…' : 'Submit Form'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
