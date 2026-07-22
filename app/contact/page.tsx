import ContactForm from './ContactForm';

export const metadata = {
  title: 'Contact | Squeegeez Window & Exterior Care',
  description: 'Get a free window washing or exterior care estimate in Castlegar, Nelson, Trail and the Kootenays.',
};

const PHONE = '(250) 784-8588';
const PHONE_HREF = 'tel:+12507848588';

export default function ContactPage() {
  return (
    <>
      <section className="hero" style={{ padding: '64px 0' }}>
        <div className="container center">
          <span className="tag">Get Started</span>
          <h1>Contact Us</h1>
          <p className="lead">
            Tell us what you need and we&rsquo;ll get back to you with a free estimate.
            Or call us at <a href={PHONE_HREF}>{PHONE}</a>.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="form-wrap">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
