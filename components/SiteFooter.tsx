import Link from 'next/link';

export default function SiteFooter() {
  const year = 2026; // update yearly if you like
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="cols">
          <div style={{ maxWidth: 320 }}>
            <h4>Squeegeez Window &amp; Exterior Care</h4>
            <p style={{ margin: 0 }}>
              Professional window washing and exterior care for homes and businesses
              across the Kootenays.
            </p>
          </div>
          <div>
            <h4>Explore</h4>
            <p style={{ margin: '0 0 6px' }}><Link href="/">Home</Link></p>
            <p style={{ margin: '0 0 6px' }}><Link href="/services">Services</Link></p>
            <p style={{ margin: 0 }}><Link href="/contact">Contact</Link></p>
          </div>
          <div>
            <h4>Service Areas</h4>
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
          <span>Serving the Kootenays, BC</span>
        </div>
      </div>
    </footer>
  );
}
