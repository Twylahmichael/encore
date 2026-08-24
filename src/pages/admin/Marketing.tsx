import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

interface DiscountCode {
  code: string;
  description: string | null;
  percent_off: number | null;
  amount_off_kes: number | null;
  active: boolean;
  expires_at: string | null;
}
interface Campaign {
  id: string;
  title: string;
  message: string;
  active: boolean;
}

// Promos (discount codes, redeemed at Checkout), Campaigns (simple
// announcements), and Rewards (member loyalty points) in one page —
// translated from the Munchiz screenshot's Promos/Campaigns/Rewards
// sidebar sections.
export function Marketing() {
  const [codes, setCodes] = useState<DiscountCode[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [newCode, setNewCode] = useState({ code: '', description: '', percent_off: '', amount_off_kes: '' });
  const [newCampaign, setNewCampaign] = useState({ title: '', message: '' });

  const load = async () => {
    const [{ data: codeData }, { data: campaignData }] = await Promise.all([
      supabase.from('discount_codes').select('code, description, percent_off, amount_off_kes, active, expires_at').order('created_at', { ascending: false }),
      supabase.from('campaigns').select('id, title, message, active').order('created_at', { ascending: false }),
    ]);
    setCodes((codeData as DiscountCode[]) ?? []);
    setCampaigns((campaignData as Campaign[]) ?? []);
  };

  useEffect(() => { load(); }, []);

  const addCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.code) return;
    await supabase.from('discount_codes').insert({
      code: newCode.code.trim().toUpperCase(),
      description: newCode.description || null,
      percent_off: newCode.percent_off ? Number(newCode.percent_off) : null,
      amount_off_kes: newCode.amount_off_kes ? Number(newCode.amount_off_kes) : null,
    });
    setNewCode({ code: '', description: '', percent_off: '', amount_off_kes: '' });
    await load();
  };

  const toggleCode = async (code: string, active: boolean) => {
    await supabase.from('discount_codes').update({ active: !active }).eq('code', code);
    await load();
  };

  const addCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampaign.title || !newCampaign.message) return;
    await supabase.from('campaigns').insert({ ...newCampaign, active: true });
    setNewCampaign({ title: '', message: '' });
    await load();
  };

  const toggleCampaign = async (id: string, active: boolean) => {
    await supabase.from('campaigns').update({ active: !active }).eq('id', id);
    await load();
  };

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-2xl mb-2">Marketing</h1>
        <p className="text-sm text-efn-black/60">Discount codes (redeemed at checkout) and campaign announcements.</p>
      </div>

      <section>
        <h2 className="font-semibold mb-4">Promos — Discount Codes</h2>
        <form onSubmit={addCode} className="flex flex-wrap gap-3 mb-6">
          <input placeholder="CODE" value={newCode.code} onChange={(e) => setNewCode((v) => ({ ...v, code: e.target.value }))} className="border border-efn-gray px-3 py-2 w-32 uppercase" />
          <input placeholder="Description" value={newCode.description} onChange={(e) => setNewCode((v) => ({ ...v, description: e.target.value }))} className="border border-efn-gray px-3 py-2 flex-1 min-w-[140px]" />
          <input placeholder="% off" type="number" min={1} max={100} value={newCode.percent_off} onChange={(e) => setNewCode((v) => ({ ...v, percent_off: e.target.value, amount_off_kes: '' }))} className="border border-efn-gray px-3 py-2 w-24" />
          <span className="self-center text-sm text-efn-black/50">or</span>
          <input placeholder="KES off" type="number" min={1} value={newCode.amount_off_kes} onChange={(e) => setNewCode((v) => ({ ...v, amount_off_kes: e.target.value, percent_off: '' }))} className="border border-efn-gray px-3 py-2 w-28" />
          <button type="submit" className="btn-solid">Add Code</button>
        </form>
        <ul className="space-y-2">
          {codes.map((c) => (
            <li key={c.code} className="flex items-center justify-between bg-efn-offwhite px-4 py-3 text-sm">
              <span>
                <strong>{c.code}</strong> — {c.percent_off ? `${c.percent_off}% off` : `KES ${c.amount_off_kes} off`}
                {c.description ? ` · ${c.description}` : ''}
              </span>
              <button onClick={() => toggleCode(c.code, c.active)} className="text-efn-green hover:underline">
                {c.active ? 'Deactivate' : 'Activate'}
              </button>
            </li>
          ))}
          {codes.length === 0 && <p className="text-sm text-efn-black/50">No discount codes yet.</p>}
        </ul>
      </section>

      <section>
        <h2 className="font-semibold mb-4">Campaigns</h2>
        <form onSubmit={addCampaign} className="flex flex-wrap gap-3 mb-6">
          <input placeholder="Title" value={newCampaign.title} onChange={(e) => setNewCampaign((v) => ({ ...v, title: e.target.value }))} className="border border-efn-gray px-3 py-2 flex-1 min-w-[140px]" />
          <input placeholder="Message" value={newCampaign.message} onChange={(e) => setNewCampaign((v) => ({ ...v, message: e.target.value }))} className="border border-efn-gray px-3 py-2 flex-[2] min-w-[200px]" />
          <button type="submit" className="btn-solid">Add Campaign</button>
        </form>
        <ul className="space-y-2">
          {campaigns.map((c) => (
            <li key={c.id} className="flex items-center justify-between bg-efn-offwhite px-4 py-3 text-sm">
              <span><strong>{c.title}</strong> — {c.message}</span>
              <button onClick={() => toggleCampaign(c.id, c.active)} className="text-efn-green hover:underline">
                {c.active ? 'Deactivate' : 'Activate'}
              </button>
            </li>
          ))}
          {campaigns.length === 0 && <p className="text-sm text-efn-black/50">No campaigns yet.</p>}
        </ul>
      </section>

      <section>
        <h2 className="font-semibold mb-4">Rewards</h2>
        <p className="text-sm text-efn-black/60">
          Members earn <code>loyalty_points</code> — adjustable per member from the Users page.
          Not auto-accrued on purchase yet (would need an order-completion trigger — flagged, not built in this pass).
        </p>
      </section>
    </div>
  );
}
