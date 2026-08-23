import { useMembershipModal } from './MembershipSignupModal';

// Final CTA section before the footer — appears on Home and Fitness Studio,
// same copy both places.
export function JoinEncoreFamily() {
  const { open } = useMembershipModal();
  return (
    <section className="bg-efn-black text-efn-white py-24 text-center">
      <div className="max-w-2xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl mb-6">
          Join the<span className="font-script text-efn-green mx-2">Encore</span>Family
        </h2>
        <p className="text-efn-white/80 mb-8">
          We've built a fitness community that thrives on motivation, discipline, and consistency.
          Here, you're not just a member — you're part of a family striving for better every day.
        </p>
        <button onClick={() => open()} className="btn-outline">Join Encore</button>
      </div>
    </section>
  );
}
