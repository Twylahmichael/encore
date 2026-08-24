import { WhyChooseEncore } from '../components/WhyChooseEncore';
import { JoinEncoreFamily } from '../components/JoinEncoreFamily';
import { useMembershipModal } from '../components/MembershipSignupModal';
import { membershipPlans } from '../data/membershipPlans';
import { useLiveSchedule } from '../lib/useLiveSchedule';
import { useSettings } from '../lib/useSettings';
import { whatsappBookingHref } from '../lib/whatsapp';
import aboutHero from '../assets/site/About-Encore-fitness.jpg';
import gym2 from '../assets/site/Encore-gym-2.jpg';
import aboutFitness2 from '../assets/site/About-Encore-fitness-2.jpg';
import aboutFitness5 from '../assets/site/About-Encore-fitness-5.jpg';

export function FitnessStudio() {
  const { open } = useMembershipModal();
  const settings = useSettings();
  const { days: schedule } = useLiveSchedule();

  return (
    <>
      {/* About Our Fitness Studio */}
      <section
        className="relative bg-cover bg-center text-efn-white py-28"
        style={{ backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.85) 100%), url(${aboutHero})` }}
      >
        <div className="max-w-site mx-auto px-6 max-w-3xl">
          <h1 className="text-4xl md:text-5xl mb-6">About Our Fitness Studio</h1>
          <p className="mb-4 text-efn-white/90">
            At Encore Fitness Studio, we believe fitness is more than just exercise — it's a
            lifestyle. Located in the heart of Buruburu, Nairobi, we offer a vibrant and welcoming
            environment designed to help you achieve your personal health and wellness goals.
          </p>
          <p className="text-efn-white/90">
            Whether you're just starting out or you're a seasoned athlete, our diverse workout
            schedule — from CrossFit and Circuit Training to Zumba and Yoga — ensures there's
            something for everyone. Our professional trainers are committed to guiding you every
            step of the way with energy, experience, and enthusiasm.
          </p>
        </div>
      </section>

      {/* Facility photo strip — placement for the two background images
          referenced in the live site's compiled CSS but never confidently
          mappable to a specific section (see docs/COMPARISON.md). Placed
          here as a simple glimpse of the space between the hero and
          Membership Plans; the other unused variants were dropped rather
          than crowding the page with a section the live site doesn't have. */}
      <div className="grid grid-cols-3 h-48 md:h-64">
        <img src={gym2} alt="Encore Fitness Studio" className="w-full h-full object-cover" />
        <img src={aboutFitness2} alt="Encore Fitness Studio" className="w-full h-full object-cover" />
        <img src={aboutFitness5} alt="Encore Fitness Studio" className="w-full h-full object-cover" />
      </div>

      {/* Membership Plans */}
      <section className="py-20" id="membership">
        <div className="max-w-site mx-auto px-6">
          <p className="text-efn-green font-semibold uppercase tracking-wide mb-2">Our Membership Plans</p>
          <h2 className="text-3xl md:text-4xl mb-12">Choose Your Plan, Commit to Your Goals!</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {membershipPlans.map((plan) => (
              <div key={plan.id} className="border border-efn-offwhite p-8 text-center flex flex-col items-center">
                <p className="text-sm text-efn-black/60 mb-1">Ksh</p>
                <p className="text-4xl font-heading font-bold mb-2">{plan.priceKes.toLocaleString('en-KE')}</p>
                <p className="mb-6">{plan.name}</p>
                <button onClick={() => open(plan.id)} className="btn-outline-dark">Join Now</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workout Schedule — the live site's table is static HTML; this
          version is tappable, matching Phase 1 of the Encore proposal:
          each session opens WhatsApp pre-filled with class/day/time. */}
      <section className="bg-efn-offwhite py-20">
        <div className="max-w-site mx-auto px-6">
          <p className="text-efn-green font-semibold uppercase tracking-wide mb-2">Workout Schedule</p>
          <h2 className="text-3xl md:text-4xl mb-4">Stay on Track, Stay Fit</h2>
          <p className="text-sm text-efn-black/60 mb-12">Tap any class to book it on WhatsApp.</p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {schedule.flatMap((day) =>
              day.sessions.map((s) => (
                <a
                  key={`${day.day}-${s.time}`}
                  href={whatsappBookingHref(settings['whatsapp.number'], settings['whatsapp.template'], {
                    class: s.className,
                    day: day.day,
                    time: s.time,
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-efn-white p-5 hover:shadow-md transition-shadow group"
                >
                  <p className="text-xs uppercase tracking-wide text-efn-green font-semibold mb-1">{day.day}</p>
                  <p className="text-lg font-semibold mb-1">{s.className}</p>
                  <p className="text-sm text-efn-black/60 mb-1">{s.label ? `${s.label} · ${s.time}` : s.time}</p>
                  {s.coachName && <p className="text-sm text-efn-black/60 mb-3">with {s.coachName}</p>}
                  <span className="text-sm font-semibold text-efn-green group-hover:underline">
                    Book on WhatsApp →
                  </span>
                </a>
              )),
            )}
          </div>

          <p className="text-xs text-efn-black/50 mt-6">
            Sunday is not listed on the live site's schedule — no Sunday sessions are currently published.
          </p>
        </div>
      </section>

      <WhyChooseEncore />
      <JoinEncoreFamily />
    </>
  );
}
