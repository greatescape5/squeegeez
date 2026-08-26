export const metadata = {
  title: 'About',
  description:
    'Squeegeez is a small, locally owned window and exterior cleaning business proudly serving the West Kootenays.',
  alternates: { canonical: '/about' },
};

const PHONE = '(250) 784-8588';
const PHONE_HREF = 'tel:+12507848588';

export default function AboutPage() {
  return (
    <>
      <section className="hero" style={{ padding: '64px 0' }}>
        <div className="container center">
          <span className="tag">About</span>
          <h1>About Squeegeez</h1>
        </div>
      </section>

      {/* OUR MISSION */}
      <section className="section tint-blue">
        <div className="container">
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            <h2>Our Mission</h2>
            <p>
              Squeegeez was founded on a commitment to providing exceptional window and exterior
              cleaning services tailored to the unique needs of your property. Your home or business
              is a significant investment, and we believe it deserves exceptional care.
            </p>
            <p style={{ marginBottom: 0 }}>
              Our approach is simple: arrive on time, communicate clearly, and deliver workmanship
              that exceeds expectations. We take pride in leaving every property looking its absolute
              best, so you can enjoy a cleaner, brighter experience without the hassle. We use
              professional techniques and premium equipment to achieve outstanding results. Every
              service is completed with precision, respect, and meticulous attention to detail.
            </p>
          </div>
        </div>
      </section>

      {/* LOCAL BY CHOICE */}
      <section className="section tint-cream">
        <div className="container">
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            <h2>Local by Choice</h2>
            <p style={{ marginBottom: 0 }}>
              Squeegeez is proud to serve the West Kootenays. Being a local business means more than
              knowing the area—it means being part of the communities we serve and building our
              reputation one customer at a time.
            </p>
          </div>
        </div>
      </section>

      {/* THE PEOPLE BEHIND SQUEEGEEZ */}
      <section className="section tint-teal">
        <div className="container">
          <div className="grid grid-2 services-split" style={{ alignItems: 'center' }}>
            <div>
              <h2>The People Behind Squeegeez</h2>
              <p style={{ marginBottom: 0 }}>
                Squeegeez is a small, locally owned business built around a genuine pride in the work
                we do. We value getting to know our customers, understanding their properties, and
                building relationships that last beyond a single service.
              </p>
            </div>
            <div>
              {/* Add your photo at public/about-team.jpg */}
              <img className="about-photo" src="/about-team.jpg" alt="The team behind Squeegeez" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section grad">
        <div className="container">
          <div className="cta-band">
            <h2>Ready to Get Started?</h2>
            <p>Have a property in mind? We&rsquo;d be happy to hear from you.</p>
            <div className="btn-row center">
              <a href={PHONE_HREF} className="btn btn-primary">Call us</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
