// Clean line icons for services/folders — replaces emojis so they render
// identically on every device. Chosen automatically from the folder slug/name.

type Props = { slug?: string | null; name?: string | null; size?: number };

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  viewBox: '0 0 24 24',
};

function House(p: { size: number }) {
  return (
    <svg width={p.size} height={p.size} {...base} aria-hidden="true">
      <path d="M3 11l9-7 9 7" />
      <path d="M5 10v10h14V10" />
      <path d="M10 20v-6h4v6" />
    </svg>
  );
}

function Building(p: { size: number }) {
  return (
    <svg width={p.size} height={p.size} {...base} aria-hidden="true">
      <rect x="4" y="3" width="16" height="18" rx="1" />
      <path d="M8 7h2M14 7h2M8 11h2M14 11h2M8 15h2M14 15h2" />
      <path d="M10 21v-3h4v3" />
    </svg>
  );
}

function Droplet(p: { size: number }) {
  return (
    <svg width={p.size} height={p.size} {...base} aria-hidden="true">
      <path d="M12 3s6 6.4 6 10a6 6 0 0 1-12 0c0-3.6 6-10 6-10z" />
      <path d="M9.5 14a2.5 2.5 0 0 0 2.5 2.5" />
    </svg>
  );
}

function Leaf(p: { size: number }) {
  return (
    <svg width={p.size} height={p.size} {...base} aria-hidden="true">
      <path d="M11 20A7 7 0 0 1 4 13C4 7 11 3 20 4c1 9-3 16-9 16z" />
      <path d="M4 21c2-6 6-9 11-10" />
    </svg>
  );
}

function Sun(p: { size: number }) {
  return (
    <svg width={p.size} height={p.size} {...base} aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" />
    </svg>
  );
}

function Sparkles(p: { size: number }) {
  return (
    <svg width={p.size} height={p.size} {...base} aria-hidden="true">
      <path d="M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8z" />
      <path d="M18 14l.9 2.1L21 17l-2.1.9L18 20l-.9-2.1L15 17l2.1-.9z" />
    </svg>
  );
}

export default function ServiceIcon({ slug, name, size = 24 }: Props) {
  const key = `${slug || ''} ${name || ''}`.toLowerCase();

  if (key.includes('commerc')) return <Building size={size} />;
  if (key.includes('resid') || key.includes('window')) return <House size={size} />;
  if (key.includes('pressure') || key.includes('wash') || key.includes('power')) return <Droplet size={size} />;
  if (key.includes('gutter')) return <Leaf size={size} />;
  if (key.includes('solar')) return <Sun size={size} />;
  return <Sparkles size={size} />;
}
