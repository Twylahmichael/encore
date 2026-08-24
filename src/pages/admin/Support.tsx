import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

interface ContactMessage {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  message: string;
  created_at: string;
}

export function Support() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  useEffect(() => {
    supabase
      .from('contact_messages')
      .select('id, first_name, last_name, email, message, created_at')
      .order('created_at', { ascending: false })
      .then(({ data }) => setMessages((data as ContactMessage[]) ?? []));
  }, []);

  return (
    <div>
      <h1 className="text-2xl mb-2">Support</h1>
      <p className="text-sm text-efn-black/60 mb-6">Messages submitted through the Contacts page form.</p>

      {messages.length === 0 ? (
        <p className="text-sm text-efn-black/50">No messages yet.</p>
      ) : (
        <div className="space-y-4">
          {messages.map((m) => (
            <div key={m.id} className="bg-efn-offwhite p-5">
              <div className="flex justify-between items-baseline mb-2">
                <p className="font-semibold">{m.first_name} {m.last_name}</p>
                <p className="text-xs text-efn-black/50">{new Date(m.created_at).toLocaleString()}</p>
              </div>
              <p className="text-sm text-efn-black/60 mb-2">
                <a href={`mailto:${m.email}`} className="hover:text-efn-green underline">{m.email}</a>
              </p>
              <p className="text-sm">{m.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
