'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="site-header">
      <div className="stripe" aria-hidden="true">
        <span /><span /><span /><span />
      </div>
      <div className="container nav">
        <Link href="/" className="brand" onClick={close}>
          <Image
            src="/logo-b11.png"
            alt="Squeegeez Window & Exterior Care"
            width={55}
            height={55}
            priority
          />
          <span>Squeegeez</span>
        </Link>

        <button
          type="button"
          className={`nav-toggle ${open ? 'open' : ''}`}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span /><span /><span />
        </button>

        <nav className={`nav-links ${open ? 'open' : ''}`}>
          <Link href="/" onClick={close}>Home</Link>
          <Link href="/services" onClick={close}>Services</Link>
          <Link href="/about" onClick={close}>About</Link>
          <Link href="/contact" onClick={close}>Contact</Link>
          <Link href="/contact" className="btn btn-primary nav-cta" onClick={close}>Get an estimate</Link>
        </nav>
      </div>
    </header>
  );
}
