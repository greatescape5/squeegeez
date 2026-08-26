import Link from 'next/link';
import SocialLinks from '@/components/SocialLinks';

export default function SiteFooter() {
  const year = 2026; // update yearly if you like
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="cols">
          <div style={{ maxWidth: 320 }}>
            <h4>Squeegeez Window &amp; Exterior Care</h4>
            <p style={{ margin: 0 }}>
              A higher standard for your property
            </p>
            <SocialLinks className="footer-social" />
          </div>
          <div>
            <h4>Explore</h4>
            <p style={{ margin: '0 0 6px' }}><Link href="/">Home</Link></p>
            <p style={{ margin: '0 0 6px' }}><Link href="/services">Services</Link></p>
            <p style={{ margin: '0 0 6px' }}><Link href="/about">About</Link></p>
            <p style={{ margin: 0 }}><Link href="/contact">Contact</Link></p>
          </div>
          <div>
            <h4>Service areas</h4>
            <p style={{ margin: 0 }}>
              Castlegar · Trail · Nelson · Fruitvale · Montrose<br />
              Rossland · Warfield · Slocan · Salmo · Creston<br />
              Grand Forks · Kaslo · Silverton
            </p>
          </div>
        </div>
        <div className="fine">
          <span>
            © {year} Squeegeez Window &amp; Exterior Care{/*
              Hidden admin link: this faint period goes to the admin login. */}
            <Link href="/admin" className="admin-dot" aria-label="Admin">.</Link>
          </span>
          <span>Serving the West Kootenays, BC</span>
        </div>

        <div className="footer-credit">
          Website designed &amp; managed by{' '}
          <a
            href="https://greatescapewebservices.com"
            target="_blank"
            rel="noopener noreferrer"
            className="credit-name"
          >
            Great Escape Web &amp; Business Services
          </a>
        </div>
      </div>
    </footer>
  );
}
