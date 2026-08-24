import { Link } from 'react-router-dom';
import { WhyChooseEncore } from '../components/WhyChooseEncore';
import { JoinEncoreFamily } from '../components/JoinEncoreFamily';
import { ProductCard } from '../components/ProductCard';
import { HeroProductParallax } from '../components/HeroProductParallax';
import { products, homepageFeaturedSlugs } from '../data/products';
import gym1 from '../assets/site/Encore-gym-1.jpg';
import gym4 from '../assets/site/Encore-gym-4.jpg';

const featured = homepageFeaturedSlugs
  .map((slug) => products.find((p) => p.slug === slug))
  .filter(Boolean) as typeof products;

export function Home() {
  return (
    <>
      {/* Hero — sampled: "Supercharge Your Every Day" over Encore-gym-1.jpg,
          dark-to-transparent gradient overlay, two pill-style CTAs, plus
          the live site's scroll-linked product-image cluster (see
          HeroProductParallax.tsx) — overflow-hidden so its inward slide
          never causes horizontal scroll. */}
      <section
        className="relative overflow-hidden bg-cover bg-top text-efn-white pt-36 pb-24"
        style={{ backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.83) 100%), url(${gym1})` }}
      >
        <div className="max-w-site mx-auto px-6 text-center">
          <h1 className="text-6xl md:text-8xl mb-6">
            Supercharge<br />Your Every Day
          </h1>
          <p className="max-w-xl mx-auto text-lg mb-10 text-efn-white/90">
            From gym gains to daily wellness, we empower you to thrive every step of the way.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            <Link to="/fitness-studio" className="btn-outline">Fitness</Link>
            <Link to="/our-products" className="btn-outline">Nutrition</Link>
          </div>
          <HeroProductParallax />
        </div>
      </section>

      {/* Our Products — homepage carousel of 8 real products */}
      <section className="py-20">
        <div className="max-w-site mx-auto px-6">
          <p className="text-efn-green font-semibold uppercase tracking-wide mb-2">Encore Nutrition</p>
          <div className="flex items-end justify-between mb-10">
            <h2 className="text-3xl md:text-4xl">Our Products</h2>
            <Link to="/our-products" className="btn-outline-dark hidden sm:inline-block">View All Products</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {featured.map((p) => <ProductCard key={p.slug} product={p} />)}
          </div>
          <Link to="/our-products" className="btn-outline-dark mt-10 inline-block sm:hidden">View All Products</Link>
        </div>
      </section>

      {/* Get to Know Encore Fitness Studio */}
      <section
        className="relative bg-cover bg-center text-efn-white py-28"
        style={{ backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.8) 100%), url(${gym4})` }}
      >
        <div className="max-w-site mx-auto px-6 text-center max-w-2xl">
          <p className="text-efn-green font-semibold uppercase tracking-wide mb-2">Encore Fitness</p>
          <h2 className="text-3xl md:text-4xl mb-6">Get to Know Encore Fitness Studio</h2>
          <p className="text-efn-white/90 mb-10">
            Encore is more than a gym — it's your second home for health, energy and transformation.
            With high-energy workouts, experienced trainers and a supportive community, we make
            fitness fun and achievable for everyone.
          </p>
          <Link to="/fitness-studio" className="btn-outline">About our Fitness Studio</Link>
        </div>
      </section>

      <WhyChooseEncore />

      <JoinEncoreFamily />
    </>
  );
}
