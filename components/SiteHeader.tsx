import Link from 'next/link';
import Image from 'next/image';

export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="stripe" aria-hidden="true">
        <span /><span /><span /><span />
      </div>
      <div className="container nav">
        <Link href="/" className="brand">
          <Image
            src="/logo.png"
            alt="Squeegeez Window & Exterior Care"
            width={44}
            height={44}
            priority
          />
          <span>Squeegeez</span>
        </Link>
        <nav className="nav-links">
          <Link href="/">Home</Link>
          <Link href="/projects">Projects</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/contact" className="btn btn-primary nav-cta">Get a Free Quote</Link>
        </nav>
      </div>
    </header>
  );
}
