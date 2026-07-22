import Link from 'next/link';
import { getProjects, getComparisons } from '@/lib/supabase';
import ServiceIcon from '@/components/ServiceIcon';
import BeforeAfter from '@/components/BeforeAfter';

// Update this to the real business phone number.
const PHONE = '(250) 784-8588';
const PHONE_HREF = 'tel:+12507848588';

// Re-check the database periodically so new highlights appear without a redeploy.
export const revalidate = 60;

const SERVICES = [
  { title: 'Residential Windows', text: 'Interior and exterior cleaning for homes of all sizes.' },
  { title: 'Commercial Windows', text: 'Storefronts on a reliable recurring schedule.' },
  { title: 'Track and Screen Cleaning', text: 'Window tracks and screens cleared of built-up dirt and debris.' },
  { title: 'Gutter Cleaning', text: 'Clear out debris before the Kootenay rains hit.' },
];

const WHY = [
  { title: 'Licensed Business', text: 'WorkSafe BC compliant.' },
  { title: 'Quality Results', text: '10+ years industry experience.' },
  { title: 'Reliable & On Time', text: 'Flexible and reliable scheduling.' },
  { title: 'Liability Insured', text: 'Protecting your job from start to finish.' },
];

const REVIEWS = [
  { text: 'Windows, gutters, and the deck all done in one visit. Huge time saver.', who: 'Dana K., Nelson' },
  { text: 'Does our storefront every two weeks. Reliable, affordable, always professional.', who: 'Tom R., Trail' },
  { text: 'Showed up on time, windows looked brand new. Will absolutely book again.', who: 'Sarah M., Castlegar' },
];

const AREAS = ['Castlegar', 'Trail', 'Nelson', 'Fruitvale', 'Montrose', 'Rossland', 'Warfield', 'Slocan', 'Salmo', 'Creston', 'Grand Forks', 'Kaslo', 'Silverton'];

export default async function HomePage() {
  const [projects, comparisons] = await Promise.all([getProjects(), getComparisons()]);
  const highlights = projects.slice(0, 3);
  const sliders = comparisons.filter((c) => c.before_image_url && c.after_image_url);

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="container center">
          <span className="tag">Castlegar, BC</span>
          <h1>Crystal Clear Windows.<br />Every Time.</h1>
          <p className="lead">
            Professional window washing and exterior care for homes and businesses
            across the West Kootenays.
          </p>
          <div className="btn-row" style={{ marginTop: 8 }}>
            <Link href="/contact" className="btn btn-primary">Get an Estimate</Link>
            <a href={PHONE_HREF} className="btn btn-outline">Call Now</a>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="section tint-blue">
        <div className="container">
          <div className="center" style={{ marginBottom: 40 }}>
            <span className="eyebrow">What We Do</span>
            <h2>Our Services</h2>
          </div>
          <div className="grid grid-4">
            {SERVICES.map((s) => (
              <div key={s.title} className="card">
                <div className="icon"><ServiceIcon name={s.title} size={26} /></div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BEFORE / AFTER SHOWCASE */}
      {sliders.length > 0 && (
        <section className="section tint-cream">
          <div className="container">
            <div className="center" style={{ marginBottom: 40 }}>
              <span className="eyebrow">See It For Yourself</span>
              <h2>Our Work in Action</h2>
              <p className="lead">Drag the slider to see the difference a professional clean makes.</p>
            </div>
            <div style={{ display: 'grid', gap: 40 }}>
              {sliders.map((c) => (
                <div key={c.id}>
                  <BeforeAfter before={c.before_image_url!} after={c.after_image_url!} />
                  {c.title && (
                    <p className="ba-hint"><strong>{c.title}</strong> — drag to compare</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PORTFOLIO HIGHLIGHTS */}
      <section className="section tint-teal">
        <div className="container">
          <div className="center" style={{ marginBottom: 40 }}>
            <span className="eyebrow">See the Difference</span>
            <h2>Our Recent Projects</h2>
          </div>

          {highlights.length > 0 ? (
            <div className="gallery-grid">
              {highlights.map((p) => (
                <div key={p.id} className="gallery-item">
                  {p.after_image_url && (
                    <img src={p.after_image_url} alt={p.name} />
                  )}
                  <div className="meta">
                    {p.category && <span className="badge">{p.category}</span>}
                    <h3>{p.name}</h3>
                    {p.description && <p>{p.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-note">
              Project photos will appear here once the gallery is loaded.
            </div>
          )}

          <div className="center" style={{ marginTop: 34 }}>
            <Link href="/services" className="btn btn-ghost">View All Services</Link>
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="section grad">
        <div className="container">
          <div className="center" style={{ marginBottom: 40 }}>
            <span className="eyebrow">Why Us</span>
            <h2>Why Choose Squeegeez?</h2>
            <p className="lead">
              Every project is completed with care, precision, and respect for your property.
            </p>
          </div>
          <div className="grid grid-4">
            {WHY.map((w) => (
              <div key={w.title} className="card">
                <h3>{w.title}</h3>
                <p>{w.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="section tint-blue">
        <div className="container">
          <div className="center" style={{ marginBottom: 40 }}>
            <span className="eyebrow">Satisfied Customers</span>
            <h2>Reviews</h2>
          </div>
          <div className="grid grid-3">
            {REVIEWS.map((r) => (
              <div key={r.who} className="review">
                <div className="stars" aria-label="5 out of 5 stars">★★★★★</div>
                <p>&ldquo;{r.text}&rdquo;</p>
                <div className="who">{r.who}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AREAS */}
      <section className="section tint-teal">
        <div className="container center">
          <span className="eyebrow">We Come To You</span>
          <h2 style={{ marginBottom: 26 }}>Areas We Service</h2>
          <div className="areas">
            {AREAS.map((a) => <span key={a}>{a}</span>)}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section grad">
        <div className="container">
          <div className="cta-band">
            <h2>Ready to Refresh Your View?</h2>
            <p>Serving Castlegar, Trail, Nelson and the surrounding Kootenays. Contact us for a free estimate today.</p>
            <div className="btn-row center">
              <Link href="/contact" className="btn btn-primary">Get an Estimate</Link>
              <a href={PHONE_HREF} className="btn btn-ghost">Call {PHONE}</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
