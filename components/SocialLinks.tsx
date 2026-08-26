// Social profile links — shared by the footer and the contact page.
// Update a URL here and it changes everywhere.

const FACEBOOK = 'https://www.facebook.com/profile.php?id=61593140935415';
const INSTAGRAM = 'https://www.instagram.com/getsqueegeez';
const TIKTOK = 'https://www.tiktok.com/@getsqueegeez';

export default function SocialLinks({ className }: { className?: string }) {
  return (
    <div className={className}>
      <a href={FACEBOOK} target="_blank" rel="noopener noreferrer" aria-label="Squeegeez on Facebook">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z" /></svg>
      </a>
      <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" aria-label="Squeegeez on Instagram">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4.5" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>
      </a>
      <a href={TIKTOK} target="_blank" rel="noopener noreferrer" aria-label="Squeegeez on TikTok">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.5 3c.3 2.2 1.9 3.9 4 4.2v2.5c-1.4 0-2.8-.4-4-1.1v6.3a5.6 5.6 0 1 1-5.6-5.6c.3 0 .6 0 .9.1v2.6a3 3 0 1 0 2.1 2.9V3h2.6z" /></svg>
      </a>
    </div>
  );
}
