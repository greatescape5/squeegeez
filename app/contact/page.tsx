import ContactForm from './ContactForm';
import HashScroll from '@/components/HashScroll';
import SocialLinks from '@/components/SocialLinks';

export const metadata = {
  title: 'Contact Us — Free Estimate',
  description: 'Get a free window washing or exterior care estimate in Castlegar, Nelson, Trail and the Kootenays. Call, text or send us a message.',
  alternates: { canonical: '/contact' },
};

const PHONE = '(250) 784-8588';
const PHONE_HREF = 'tel:+12507848588';
const EMAIL = 'contact@squeegeez.ca';

export default function ContactPage() {
  return (
    <>
      <HashScroll />
      <section className="hero" style={{ padding: '64px 0' }}>
        <div className="container center">
          <span className="tag">Get Started</span>
          <h1>Let&rsquo;s talk about your property</h1>
          <p className="lead">
            The easiest way to get a free estimate is to give us a call. We&rsquo;ll take the time
            to understand what you&rsquo;re looking for and discuss the best way to move forward.
          </p>
          <div className="btn-row center" style={{ marginTop: 8 }}>
            <a href={PHONE_HREF} className="btn btn-primary">Call us</a>
          </div>
        </div>
      </section>

      {/* GET IN TOUCH */}
      <section id="get-in-touch" className="section tint-cream anchor-offset">
        <div className="container">
          <div className="center" style={{ marginBottom: 40 }}>
            <span className="eyebrow">Prefer to reach out online?</span>
            <h2>Get in touch</h2>
          </div>
          <div className="grid grid-2 services-split">
            {/* Contact info card */}
            <div className="card contact-info">
              <div className="ci-row">
                <span className="ci-ic" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.4-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />
                  </svg>
                </span>
                <div>
                  <strong>Call or text</strong>
                  <a href={PHONE_HREF}>{PHONE}</a>
                </div>
              </div>
              <div className="ci-row">
                <span className="ci-ic" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="M3 7l9 6 9-6" />
                  </svg>
                </span>
                <div>
                  <strong>Email us</strong>
                  <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
                </div>
              </div>
              <div className="ci-row">
                <span className="ci-ic" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </span>
                <div>
                  <strong>Located in</strong>
                  <span>Castlegar, BC</span>
                </div>
              </div>
              <div className="ci-follow">
                <strong>Follow us</strong>
                <SocialLinks className="contact-social" />
              </div>
            </div>

            {/* Form */}
            <div className="card">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* OUR MISSION */}
      <section className="section">
        <div className="container">
          <div className="grid grid-2 services-split">
            <div>
              <span className="eyebrow">Our mission</span>
              <p>
                Squeegeez was founded on a commitment to providing exceptional window
                and exterior cleaning services tailored to the unique needs of your property. Your home
                or business is a significant investment, and we believe it deserves exceptional care.
              </p>
              <p>
                Our approach is simple: arrive on time, communicate clearly, and deliver workmanship
                that exceeds expectations. We take pride in leaving every property looking its absolute
                best, so you can enjoy a cleaner, brighter experience without the hassle. We use
                professional techniques and premium equipment to achieve outstanding results. Every
                service is completed with precision, respect, and meticulous attention to detail.
              </p>
            </div>
            <div>
              {/* Replace with your team photo: drop it at public/our-story.jpg */}
              <img
                className="story-photo"
                src="https://placehold.co/800x600/0f3a56/ffffff?text=Our+Team"
                alt="The Squeegeez team"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
