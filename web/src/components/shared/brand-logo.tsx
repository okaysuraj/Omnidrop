import { Zap } from 'lucide-react';
import Link from 'next/link';

export function BrandLogo() {
  return (
    <Link href="/" className="brand-logo" aria-label="Omnidrop home">
      <span className="brand-mark">
        <Zap size={21} aria-hidden="true" />
      </span>
      <span className="brand-wordmark">OMNIDROP</span>
    </Link>
  );
}
