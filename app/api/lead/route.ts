import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

type LeadBody = {
  name?: string;
  email?: string;
  phone?: string;
  service?: string;
  message?: string;
};

export async function POST(req: Request) {
  let body: LeadBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const name = (body.name || '').trim();
  const email = (body.email || '').trim();
  const phone = (body.phone || '').trim();
  const service = (body.service || '').trim();
  const message = (body.message || '').trim();

  if (!name || !email) {
    return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 });
  }

  // ---- 1. Save the lead to Supabase ----
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  let saved = false;
  try {
    if (url && anonKey) {
      const supabase = createClient(url, anonKey);
      const { error } = await supabase
        .from('leads')
        .insert([{ name, email, phone, service, message }]);
      if (!error) saved = true;
    }
  } catch {
    // Swallow — we'll still try email, and report below.
  }

  // ---- 2. Best-effort emails via Resend (only if configured) ----
  const resendKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.LEAD_TO_EMAIL;      // business owner
  const fromEmail = process.env.LEAD_FROM_EMAIL;  // verified sender on your domain

  if (resendKey && toEmail && fromEmail) {
    try {
      const { Resend } = await import('resend');
      const resend = new Resend(resendKey);

      // Notification to the business
      await resend.emails.send({
        from: fromEmail,
        to: toEmail,
        replyTo: email,
        subject: `New quote request from ${name}`,
        text:
          `New lead from the Squeegeez website:\n\n` +
          `Name: ${name}\nEmail: ${email}\nPhone: ${phone || '—'}\n` +
          `Service: ${service || '—'}\n\nMessage:\n${message || '—'}`,
      });

      // Confirmation to the customer
      await resend.emails.send({
        from: fromEmail,
        to: email,
        subject: 'We got your request — Squeegeez Window & Exterior Care',
        text:
          `Hi ${name},\n\n` +
          `Thanks for reaching out to Squeegeez Window & Exterior Care. ` +
          `We've received your request and will get back to you shortly with a free estimate.\n\n` +
          `— The Squeegeez Team`,
      });
    } catch {
      // Email failed — that's fine, the lead is what matters.
    }
  }

  // As long as we saved OR email is off, treat as success so the form still works
  // during early setup. If nothing at all is configured, still return ok so the
  // customer isn't blocked — but log server-side.
  if (!saved && !(url && anonKey)) {
    console.warn('Lead received but Supabase env vars are not set yet.');
  }

  return NextResponse.json({ ok: true, saved });
}
