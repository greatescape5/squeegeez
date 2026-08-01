import Link from 'next/link';
import { getFolders, getProjects } from '@/lib/supabase';
import ServiceIcon from '@/components/ServiceIcon';

export const metadata = {
  title: 'Window Cleaning, Gutter & Pressure Washing Services',
  description:
    'Residential and commercial window cleaning, gutter cleaning, track & screen cleaning and pressure washing across Castlegar, Nelson, Trail and the Kootenays.',
  alternates: { canonical: '/services' },
};

// Re-check the database periodically so new folders/photos appear without a redeploy.
export const revalidate = 60;

const PHONE = '(250) 784-8588';
const PHONE_HREF = 'tel:+12507848588';
const SERVICE_NAMES = ['Residential Windows', 'Commercial Windows', 'Track and Screen Cleaning', 'Gutter Cleaning'];

export default async function ServicesPage() {
  const [folders, projects] = await Promise.all([getFolders(), getProjects()]);

  // Group projects by folder so each card can show a cover photo + count.
  const byFolder = new Map<string, typeof projects>();
  for (const p of projects) {
    if (!p.folder_id) continue;
    const list = byFolder.get(p.folder_id) ?? [];
    list.push(p);
    byFolder.set(p.folder_id, list);
  }

  return (
    <>
      <section className="hero" style={{ padding: '64px 0' }}>
        <div className="container center">
          <span className="tag">What We Offer</span>
          <h1>Our Services</h1>
          <p className="lead">
            Everything your home or business exterior needs — done right, by people who care.
            Tap a service to see recent work.
          </p>
        </div>
      </section>

      {/* EVERYTHING WE DO + NOT SURE WHAT YOU NEED */}
      <section className="section">
        <div className="container">
          <div className="grid grid-2 services-split">
            <div>
              <span className="eyebrow">Full List</span>
              <h2>Everything We Do</h2>
              <div className="card list-card">
                {SERVICE_NAMES.map((name) => (
                  <div key={name} className="service-row">
                    <span className="service-row-ic"><ServiceIcon name={name} size={24} /></span>
                    <span>{name}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="need-help">
              <h2>Not Sure What You Need?</h2>
              <p>
                We&rsquo;ll figure it out together. Get in touch for a free, no-pressure estimate —
                we serve Castlegar, Trail, Nelson, and the surrounding Kootenays.
              </p>
              <Link href="/contact#get-in-touch" className="btn btn-primary">Get an Estimate</Link>
              <a href={PHONE_HREF} className="btn btn-ghost">Call {PHONE}</a>
            </div>
          </div>
        </div>
      </section>

      <section className="section tint-teal">
        <div className="container">
          {folders.length > 0 ? (
            <div className="gallery-grid">
              {folders.map((f) => {
                const items = byFolder.get(f.id) ?? [];
                const cover = items.find((p) => p.after_image_url)?.after_image_url || null;
                return (
                  <Link key={f.id} href={`/services/${f.slug}`} className="gallery-item folder-card">
                    {cover ? (
                      <img src={cover} alt={f.name} />
                    ) : (
                      <div className="folder-cover-empty" aria-hidden="true">
                        <ServiceIcon slug={f.slug} name={f.name} size={56} />
                      </div>
                    )}
                    <div className="meta">
                      <h3 className="folder-title">
                        <span className="folder-ic"><ServiceIcon slug={f.slug} name={f.name} size={22} /></span>
                        {f.name}
                      </h3>
                      {f.description && <p>{f.description}</p>}
                      <span className="folder-count">
                        {items.length} {items.length === 1 ? 'photo' : 'photos'} · View →
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="empty-note">
              <p style={{ margin: 0 }}>Services will appear here once they&rsquo;re added in the admin.</p>
            </div>
          )}

        </div>
      </section>

      {/* FINAL CTA */}
      <section className="section cta-final">
        <div className="container center">
          <span className="eyebrow">Let&rsquo;s Get Started</span>
          <h2>Start Your Project With Confidence</h2>
          <p>Contact Squeegeez today for a free estimate — no pressure, no obligations.</p>
          <div className="btn-row center">
            <Link href="/contact#get-in-touch" className="btn btn-primary">Get an Estimate</Link>
            <a href={PHONE_HREF} className="btn btn-ghost">Call Now</a>
          </div>
        </div>
      </section>
    </>
  );
}
