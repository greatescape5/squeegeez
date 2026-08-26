'use client';

import { useState } from 'react';

const SERVICES = [
  'Residential windows',
  'Commercial windows',
  'Track & screen cleaning',
  'Gutter cleaning',
  'Other / not sure',
];

type Status = 'idle' | 'sending' | 'ok' | 'error';

export default function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      phone: (form.elements.namedItem('phone') as HTMLInputElement).value,
      address: (form.elements.namedItem('address') as HTMLInputElement).value,
      service: (form.elements.namedItem('service') as HTMLSelectElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Request failed');
      setStatus('ok');
      form.reset();
    } catch {
      setStatus('error');
    }
  }

  if (status === 'ok') {
    return (
      <div className="alert ok">
        Thanks! Your request came through. We&rsquo;ll be in touch shortly with your free estimate.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {status === 'error' && (
        <div className="alert err">
          Something went wrong sending your request. Please try again, or call us directly.
        </div>
      )}

      <div className="field">
        <label htmlFor="name">Name</label>
        <input id="name" name="name" type="text" required placeholder="Your name" />
      </div>

      <div className="field">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required placeholder="you@example.com" />
      </div>

      <div className="field">
        <label htmlFor="phone">Phone</label>
        <input id="phone" name="phone" type="tel" placeholder="(250) 555-0123" />
      </div>

      <div className="field">
        <label htmlFor="address">Address</label>
        <input id="address" name="address" type="text" placeholder="Street, city (helps us prepare your estimate)" />
      </div>

      <div className="field">
        <label htmlFor="service">What do you need?</label>
        <select id="service" name="service" defaultValue="">
          <option value="" disabled>Select a service…</option>
          {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="field">
        <label htmlFor="message">Message</label>
        <textarea id="message" name="message" placeholder="Tell us about your property & what you're looking for." />
      </div>

      <button type="submit" className="btn btn-primary" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending…' : 'Get an estimate'}
      </button>
      <p className="form-note" style={{ marginTop: 12 }}>
        We&rsquo;ll only use your details to respond to your request.
      </p>
    </form>
  );
}
