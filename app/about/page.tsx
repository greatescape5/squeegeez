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

      {/* ABOUT — photo on top, stacked story */}
      <section className="section tint-blue">
        <div className="container">
          <div className="grid grid-2 services-split">
            <div>
              {/* Photo at public/about-team.png */}
              <img className="about-photo" src="/about-team.png" alt="The team behind Squeegeez" style={{ margin: 0 }} />
            </div>
            <div>
              <h3 style={{ marginTop: 0 }}>The People Behind Squeegeez</h3>
              <p>
                Squeegeez is a small, locally owned business built around a genuine pride in the work
                we do. We value getting to know our customers, understanding their properties, and
                building relationships that last beyond a single service.
              </p>

              <h3 style={{ marginTop: 28 }}>Our Mission</h3>
              <p>
                Squeegeez was founded on a commitment to providing exceptional window and exterior
                cleaning services tailored to the unique needs of your property. Your home or business
                is a significant investment, and we believe it deserves exceptional care.
              </p>
              <p>
                Our approach is simple: arrive on time, communicate clearly, and deliver workmanship
                that exceeds expectations. We take pride in leaving every property looking its absolute
                best, so you can enjoy a cleaner, brighter experience without the hassle. We use
                professional techniques and premium equipment to achieve outstanding results. Every
                service is completed with precision, respect, and meticulous attention to detail.
              </p>

              <h3 style={{ marginTop: 28 }}>Local by Choice</h3>
              <p style={{ marginBottom: 0 }}>
                Squeegeez is proud to serve the West Kootenays. Being a local business means more than
                knowing the area—it means being part of the communities we serve and building our
                reputation one customer at a time.
              </p>
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
