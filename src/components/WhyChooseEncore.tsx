// Appears verbatim on both Home and Fitness Studio pages on the live site —
// same heading, same four feature cards, same copy.
const features = [
  {
    title: 'Certified Personal Trainers',
    body: 'Our experienced trainers offer personalized coaching, goal tracking, and motivation to help you level up.',
  },
  {
    title: 'Elite Training Environment',
    body: 'State-of-the-art equipment, functional zones, and a motivating atmosphere that fuels serious workouts.',
  },
  {
    title: 'Affordable Membership Plans',
    body: 'No one-size-fits-all here. Choose from day passes, monthly plans, or annual access to match your lifestyle.',
  },
  {
    title: 'Clean, Safe and Convenient',
    body: 'We prioritize hygiene and safety, ensuring a spotless environment and a hassle-free experience every time you train.',
  },
];

export function WhyChooseEncore() {
  return (
    <section className="bg-efn-offwhite py-20">
      <div className="max-w-site mx-auto px-6">
        <p className="text-efn-green font-semibold uppercase tracking-wide mb-2">Encore Fitness</p>
        <h2 className="text-3xl md:text-4xl mb-12 max-w-2xl">Why Choose Encore for your Fitness Goals</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f) => (
            <div key={f.title} className="bg-efn-white p-6">
              <h3 className="text-lg mb-3">{f.title}</h3>
              <p className="text-sm text-efn-black/70">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
