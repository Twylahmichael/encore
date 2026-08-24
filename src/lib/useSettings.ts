import { useEffect, useState } from 'react';
import { supabase } from './supabase';

// Falls back to these defaults (matching supabase/seed.sql) if the
// `settings` table hasn't loaded yet or the Supabase project isn't
// configured — so WhatsApp booking still works with a placeholder number
// even before an owner sets the real one via the admin panel.
const DEFAULTS: Record<string, string> = {
  'whatsapp.number': '2547XXXXXXXX',
  'whatsapp.template': "Hi Encore, I'd like to book {class} on {day} at {time}",
};

export function useSettings() {
  const [settings, setSettings] = useState<Record<string, string>>(DEFAULTS);

  useEffect(() => {
    let cancelled = false;
    supabase
      .from('settings')
      .select('key, value')
      .then(({ data, error }) => {
        if (cancelled || error || !data) return;
        setSettings((prev) => ({
          ...prev,
          ...Object.fromEntries(data.map((row) => [row.key, row.value])),
        }));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return settings;
}
