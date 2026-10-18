'use client';

import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const sync = () =>
      setDark(
        document.documentElement.dataset.theme === 'dark' ||
          (!document.documentElement.dataset.theme && media.matches),
      );
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  function toggle() {
    const next = !dark;
    document.documentElement.dataset.theme = next ? 'dark' : 'light';
    setDark(next);
    try {
      localStorage.setItem('omnidrop-theme', next ? 'dark' : 'light');
    } catch {
      /* Theme still works when storage is unavailable. */
    }
  }

  return (
    <button
      type="button"
      className="icon-button"
      onClick={toggle}
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={dark ? 'Light theme' : 'Dark theme'}
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
