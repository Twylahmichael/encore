import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

interface AuditRow {
  id: string;
  actor_email: string;
  action: string;
  entity: string;
  entity_id: string | null;
  at: string;
}

// Owner-only ("who changed what, when" per the Encore proposal). Note: this
// pass wires the read view; writing audit rows on every schedule/content
// mutation (via a Postgres trigger, ideally, so it can't be bypassed) is not
// yet implemented — see docs/COMPARISON.md.
export function AuditLog() {
  const [rows, setRows] = useState<AuditRow[]>([]);

  useEffect(() => {
    supabase.from('audit_log').select('id, actor_email, action, entity, entity_id, at').order('at', { ascending: false }).limit(100)
      .then(({ data }) => setRows((data as AuditRow[]) ?? []));
  }, []);

  return (
    <div>
      <h1 className="text-2xl mb-2">Audit Log</h1>
      <p className="text-sm text-efn-black/60 mb-6">Owner-only. Append-only — nothing here can be edited or deleted.</p>

      {rows.length === 0 ? (
        <p className="text-sm text-efn-black/50">
          No entries yet — audit-writing triggers aren't wired up in this pass, so mutations
          via the Schedule/Content managers above don't record here yet.
        </p>
      ) : (
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="text-left text-sm text-efn-black/60 border-b border-efn-gray/30">
              <th className="py-2 pr-4">When</th>
              <th className="py-2 pr-4">Who</th>
              <th className="py-2 pr-4">Action</th>
              <th className="py-2 pr-4">Entity</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-efn-gray/10 text-sm">
                <td className="py-2 pr-4">{new Date(r.at).toLocaleString()}</td>
                <td className="py-2 pr-4">{r.actor_email}</td>
                <td className="py-2 pr-4">{r.action}</td>
                <td className="py-2 pr-4">{r.entity} {r.entity_id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
