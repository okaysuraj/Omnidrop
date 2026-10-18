import type { ReactNode } from 'react';

export function SectionTag({
  children,
  variant = 'yellow',
}: {
  children: ReactNode;
  variant?: 'yellow' | 'black';
}) {
  const base =
    'inline-flex items-center gap-2 px-3 py-1 font-tech text-[11px] font-bold uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_#000] mb-3';
  const colors = variant === 'yellow' ? 'bg-[#FFE600] text-black' : 'bg-black text-white';
  return <div className={`${base} ${colors}`}>{children}</div>;
}
