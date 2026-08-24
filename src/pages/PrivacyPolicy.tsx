// Written 2026-08-23 to replace the live site's unedited WordPress default
// privacy policy template (every section of the original still said
// "Suggested text:" verbatim — nobody had customized it). This is a real,
// Encore-specific policy covering what this app actually collects.
//
// This is not a substitute for legal review — it accurately describes what
// the app does today, but Encore should have a lawyer confirm it before
// treating it as final, particularly the data-retention and third-party
// sections once a payment gateway and SMS provider are actually wired up.
export function PrivacyPolicy() {
  return (
    <section className="py-16">
      <div className="max-w-site mx-auto px-6 max-w-3xl">
        <h1 className="text-3xl md:text-4xl mb-2">Privacy Policy</h1>
        <p className="text-sm text-efn-black/50 mb-10">Last updated 23 August 2026.</p>

        <div className="space-y-8 text-efn-black/80">
          <div>
            <h2 className="text-xl font-semibold mb-2">Who we are</h2>
            <p>
              This policy covers efn.co.ke and the Encore member portal and admin systems
              operated by Encore Fitness and Nutrition, Nairobi. Questions about this policy or
              your data can be sent through our <a href="/contacts" className="underline hover:text-efn-green">Contacts</a> page.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">What we collect</h2>
            <p className="mb-3">We collect different information depending on how you use the site:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Contact form</strong> — first name, last name, email address, and the
                message you send us.
              </li>
              <li>
                <strong>Membership signup</strong> — the plan you're interested in, your first
                name, email address, and phone number.
              </li>
              <li>
                <strong>Product orders</strong> — your name, email, phone number, and delivery
                address, plus the items and quantities in your order.
              </li>
              <li>
                <strong>Member accounts</strong> (My Encore portal) — your name, phone number, and
                email/password used to sign in, plus your class booking history.
              </li>
              <li>
                <strong>Class bookings made over WhatsApp</strong> — when you tap "Book on
                WhatsApp" from the schedule, your message (including your name and phone number,
                if you share them) goes directly to Encore's WhatsApp number. We don't see or
                store the content of that conversation ourselves — WhatsApp/Meta's own privacy
                policy governs that message.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">How we use your phone number</h2>
            <p>
              Your phone number is used to identify you as a member, to contact you about a
              booking or order, and — if you book a class via WhatsApp — to have that
              conversation with you directly on WhatsApp. We don't sell or share your phone
              number with third parties for marketing.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Payments and M-Pesa</h2>
            <p>
              This site does not currently process card or M-Pesa payments automatically.
              When you place an order, we record your order details and contact you (by phone or
              WhatsApp) to confirm payment, typically via M-Pesa Till/Paybill. We do not store
              your M-Pesa PIN, and we never ask for it — M-Pesa transactions happen directly
              between you and Safaricom through your own phone. We keep a record of the M-Pesa
              transaction reference you provide us, for reconciliation, but not your M-Pesa
              account credentials.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">How long we keep your data</h2>
            <p>
              Order and booking records are kept for as long as needed for accounting and
              customer service purposes. Contact form and membership signup submissions are kept
              until we've responded and for a reasonable period after, in case you follow up.
              If you delete your member account, we remove your profile information but may
              retain anonymized booking records for scheduling/attendance statistics.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Who can see your data</h2>
            <p>
              Encore staff and owners with admin access can see bookings, orders, and contact/
              membership submissions in order to run the studio and shop. We don't sell your data
              or share it with advertisers. Our systems are hosted on Supabase (database/auth) —
              see <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-efn-green">Supabase's privacy policy</a> for how they handle infrastructure-level data.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Your rights</h2>
            <p className="mb-3">You can ask us to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>See what personal data we hold about you</li>
              <li>Correct inaccurate data</li>
              <li>Delete your account and associated personal data (subject to records we're
                legally required to keep, e.g. for tax/accounting)</li>
              <li>Stop using your phone number/email for anything beyond fulfilling an active
                booking or order</li>
            </ul>
            <p className="mt-3">
              To exercise any of these, reach us via the <a href="/contacts" className="underline hover:text-efn-green">Contacts</a> page.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Cookies</h2>
            <p>
              The member portal and admin panel use a session cookie/local browser storage to
              keep you signed in. We don't use tracking or advertising cookies.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Changes to this policy</h2>
            <p>
              If how we handle your data changes materially — for example, if we add a payment
              gateway or SMS provider — we'll update this page and the "Last updated" date above.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
