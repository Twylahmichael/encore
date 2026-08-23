import { WhyChooseEncore } from '../components/WhyChooseEncore';
import { JoinEncoreFamily } from '../components/JoinEncoreFamily';
import { useMembershipModal } from '../components/MembershipSignupModal';
import { membershipPlans } from '../data/membershipPlans';
import { schedule } from '../data/schedule';
import aboutHero from '../assets/site/About-Encore-fitness.jpg';

export function FitnessStudio() {
  const { open } = useMembershipModal();

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

      {/* Workout Schedule — static today; Phase 1 of the Encore proposal
          replaces this table with a DB-backed board with WhatsApp booking. */}
      <section className="bg-efn-offwhite py-20">
        <div className="max-w-site mx-auto px-6">
          <p className="text-efn-green font-semibold uppercase tracking-wide mb-2">Workout Schedule</p>
          <h2 className="text-3xl md:text-4xl mb-12">Stay on Track, Stay Fit</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[600px]">
              <tbody>
                {schedule.map((day) => (
                  <tr key={day.day} className="border-b border-efn-gray/30">
                    <td className="py-4 pr-6 font-semibold whitespace-nowrap align-top">{day.day}</td>
                    <td className="py-4">
                      {day.sessions.map((s) => (
                        <div key={s.time} className="mb-1 last:mb-0">
                          <span className="text-efn-black/60">{s.label ? `${s.label} (${s.time})` : s.time}</span>{' '}
                          <span className="font-medium">{s.className}</span>
                        </div>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-efn-black/50 mt-4">
            Sunday is not listed on the live site's schedule — no Sunday sessions are currently published.
          </p>
        </div>
      </section>

      <WhyChooseEncore />
      <JoinEncoreFamily />
    </>
  );
}
