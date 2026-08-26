import type { Metadata } from 'next';
import Link from 'next/link';
import { getProjects, getComparisons } from '@/lib/supabase';
import ServiceIcon from '@/components/ServiceIcon';
import BeforeAfter from '@/components/BeforeAfter';

export const metadata: Metadata = {
  title: 'Window Cleaning in Castlegar & the Kootenays | Squeegeez',
  description:
    'Squeegeez provides professional window washing, gutter cleaning and exterior care for homes and businesses in Castlegar, Nelson, Trail and across the West Kootenays. Book a free estimate.',
  alternates: { canonical: '/' },
};

// Update this to the real business phone number.
const PHONE = '(250) 784-8588';
const PHONE_HREF = 'tel:+12507848588';

// Re-check the database periodically so new highlights appear without a redeploy.
export const revalidate = 60;

const SERVICES = [
  { title: 'Residential windows', text: 'Interior and exterior cleaning with careful attention to detail, leaving your glass, frames, and sills looking their best.' },
  { title: 'Commercial windows', text: 'Consistent care for storefronts and commercial properties, with recurring schedules tailored to your property and needs.' },
  { title: 'Track and screen cleaning', text: 'A detailed clean of window tracks and screens, removing built-up dust, dirt, and debris for a cleaner, more finished result.' },
  { title: 'Gutter cleaning', text: 'Thorough removal of leaves, debris, and buildup, helping keep your gutters clear and your property protected from water overflow.' },
];

const WHY = [
  { title: 'Licensed business', text: 'Trusted, professional service.' },
  { title: 'Quality results', text: '10+ years industry experience.' },
  { title: 'Reliable & on time', text: 'Flexible and reliable scheduling.' },
  { title: 'Liability insured', text: 'Protecting your job from start to finish.' },
];

// Safety credentials shown in the Health & Safety section (edit the copy freely).
const SAFETY = [
  { title: 'WorkSafeBC compliant', text: 'We follow WorkSafeBC standards on every job.' },
  { title: 'Ladder safety', text: 'Trained in safe ladder setup and use on every property.' },
  { title: 'Fall protection', text: 'Proper gear and procedures whenever we work at height.' },
  { title: 'WHMIS', text: 'Certified in the safe handling of workplace materials.' },
  { title: 'First Aid certified', text: 'Ready to respond quickly if anything comes up on the job.' },
];

// Reviews are hidden until we have real ones — set to true to show the section again.
const SHOW_REVIEWS = false;

// Project gallery hidden until we have more photos — set to true to show it again.
const SHOW_PROJECTS = false;

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
      <section className="hero home-hero">
        <div className="container center">
          <span className="tag">Castlegar, BC</span>
          <h1>Crystal clear windows.<br />Done right.</h1>
          <h2 className="hero-subtitle">Proudly serving the West Kootenays</h2>
          <p className="lead">
            Professional window washing and exterior care for homes and businesses.
          </p>
          <div className="btn-row" style={{ marginTop: 8 }}>
            <Link href="/contact#get-in-touch" className="btn btn-primary">Get an estimate</Link>
            <a href={PHONE_HREF} className="btn btn-outline">Call now</a>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="section tint-blue">
        <div className="container">
          <div className="center" style={{ marginBottom: 40 }}>
            <span className="eyebrow">What We Do</span>
            <h2>Our services</h2>
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
              <h2>Our work in action</h2>
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

      {/* PORTFOLIO HIGHLIGHTS — hidden until we have more photos (SHOW_PROJECTS) */}
      {SHOW_PROJECTS && (
      <section className="section tint-teal">
        <div className="container">
          <div className="center" style={{ marginBottom: 40 }}>
            <span className="eyebrow">See the Difference</span>
            <h2>Our recent projects</h2>
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
            <Link href="/services" className="btn btn-ghost">View all services</Link>
          </div>
        </div>
      </section>
      )}

      {/* WHY US */}
      <section className="section grad">
        <div className="container">
          <div className="center" style={{ marginBottom: 40 }}>
            <span className="eyebrow">Why Us</span>
            <h2>Why choose Squeegeez?</h2>
            <p className="lead">
              With 10+ years of hands-on experience and a deep understanding of professional
              window and exterior cleaning, we bring the knowledge, precision, and attention to
              detail that exceptional results require. We take pride in doing the job
              properly—from the products and techniques we use to the way we treat your
              property—so you can feel confident your home or business is in capable hands.
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

      {/* HEALTH & SAFETY */}
      <section className="section tint-blue">
        <div className="container">
          <div className="center" style={{ marginBottom: 40 }}>
            <span className="eyebrow">Health &amp; Safety</span>
            <h2>Safety comes standard</h2>
            <p className="lead">
              Every job presents its own considerations, from working at height and navigating
              delicate surfaces to accessing hard-to-reach areas. We assess each property, use the
              right equipment and techniques, and put the appropriate safety measures in place
              before we begin. This allows us to deliver great results while protecting your
              property and everyone involved.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
            {SAFETY.map((s) => (
              <div key={s.title} className="card">
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS — hidden until we have real reviews (SHOW_REVIEWS) */}
      {SHOW_REVIEWS && (
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
      )}

      {/* AREAS */}
      <section className="section tint-teal">
        <div className="container center">
          <span className="eyebrow">We Come To You</span>
          <h2 style={{ marginBottom: 26 }}>Areas we service</h2>
          <div className="areas">
            {AREAS.map((a) => <span key={a}>{a}</span>)}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section grad">
        <div className="container">
          <div className="cta-band">
            <h2>Ready to refresh your view?</h2>
            <p>Serving Castlegar, Trail, Nelson and the surrounding Kootenays. Contact us for a free estimate today.</p>
            <div className="btn-row center">
              <Link href="/contact#get-in-touch" className="btn btn-primary">Get an estimate</Link>
              <a href={PHONE_HREF} className="btn btn-ghost">Call {PHONE}</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
