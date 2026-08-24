import { useState } from 'react';
import { supabase } from '../lib/supabase';

export function Contacts() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    const form = new FormData(e.currentTarget);

    const { error } = await supabase.from('contact_messages').insert({
      first_name: String(form.get('firstName')),
      last_name: String(form.get('lastName')),
      email: String(form.get('email')),
      message: String(form.get('message')),
    });

    if (error) {
      setError('Could not send — please try again, or reach us on WhatsApp/phone.');
      setSubmitting(false);
      return;
    }

    setSubmitted(true);
    setSubmitting(false);
  };

  return (
    <section className="py-16">
      <div className="max-w-site mx-auto px-6">
        <h1 className="text-4xl md:text-5xl mb-12 max-w-2xl">Get In Touch. We're here for You</h1>

        <div className="grid lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-2xl mb-6">Send Us a Message</h2>
            {submitted ? (
              <p>Thanks for reaching out — we'll get back to you shortly.</p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <label className="block">
                    <span className="block text-sm mb-1">First Name</span>
                    <input name="firstName" required className="w-full border border-efn-gray px-4 py-3" />
                  </label>
                  <label className="block">
                    <span className="block text-sm mb-1">Last Name</span>
                    <input name="lastName" required className="w-full border border-efn-gray px-4 py-3" />
                  </label>
                </div>
                <label className="block">
                  <span className="block text-sm mb-1">Email</span>
                  <input type="email" name="email" required className="w-full border border-efn-gray px-4 py-3" />
                </label>
                <label className="block">
                  <span className="block text-sm mb-1">Your Message</span>
                  <textarea name="message" required rows={5} className="w-full border border-efn-gray px-4 py-3" />
                </label>
                {error && <p className="text-red-600 text-sm">{error}</p>}
                <button type="submit" disabled={submitting} className="btn-solid">
                  {submitting ? '…' : 'Submit Form'}
                </button>
              </form>
            )}
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold mb-2">Call Us On</h3>
              <p>
                <a href="tel:+254757840844" className="hover:text-efn-green">0757 840844</a>
                {' / '}
                <a href="tel:+254780840844" className="hover:text-efn-green">0780 840844</a>
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Visit Us at</h3>
              <p>2nd Floor, Quickmart Buruburu Building, Suite No. 228, Nairobi</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Follow Us On</h3>
              {/* Live site links only these two — Facebook and Instagram.
                  No TikTok link currently exists; see docs/COMPARISON.md. */}
              <div className="flex gap-4">
                <a
                  href="https://www.facebook.com/share/196N1fNGHj/?mibextid=qi2Omg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-efn-green"
                >
                  Facebook
                </a>
                <a
                  href="https://www.instagram.com/encorefitness_buru?igsh=MWE1NDN0bm5hbWo4bg=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-efn-green"
                >
                  Instagram
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
