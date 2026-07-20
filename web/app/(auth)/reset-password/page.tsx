"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  // Strength calculation
  let strength = 0;
  if (password.length >= 8) strength += 25;
  if (/[A-Z]/.test(password)) strength += 25;
  if (/[0-9]/.test(password)) strength += 25;
  if (/[^A-Za-z0-9]/.test(password)) strength += 25;

  let strengthColor = 'bg-error';
  let strengthText = 'Weak';
  let strengthTextColor = 'text-error';
  if (strength > 25 && strength <= 50) { strengthColor = 'bg-tertiary'; strengthText = 'Fair'; strengthTextColor = 'text-tertiary'; }
  else if (strength > 50 && strength <= 75) { strengthColor = 'bg-primary-fixed-dim'; strengthText = 'Good'; strengthTextColor = 'text-primary'; }
  else if (strength > 75) { strengthColor = 'bg-primary-container'; strengthText = 'Strong'; strengthTextColor = 'text-primary'; }
  if (password.length === 0) { strengthColor = 'bg-error'; strengthText = 'Weak'; strengthTextColor = 'text-outline'; strength = 0; }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push('/login');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-background selection:bg-primary-container selection:text-on-primary-container">
      <header className="w-full sticky top-0 bg-background z-50 flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="hover:opacity-80 transition-opacity active:scale-95 transition-transform">
            <span className="material-symbols-outlined text-primary">arrow_back</span>
          </button>
          <h1 className="font-bold text-xl text-on-background">Set New Password</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto px-5 pt-10 pb-24 flex flex-col flex-grow w-full">
        <div className="mb-10">
          <div className="w-16 h-16 bg-primary-container rounded-2xl flex items-center justify-center mb-6 shadow-sm">
            <span className="material-symbols-outlined text-primary text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>lock_reset</span>
          </div>
          <h2 className="font-bold text-2xl text-on-surface mb-2">Secure Your Account</h2>
          <p className="text-base text-on-surface-variant">Choose a strong password that you haven't used before to ensure your account stays protected.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 flex-grow">
          {/* New Password Input */}
          <div className="space-y-2 group">
            <label className="font-bold text-xs text-on-surface-variant uppercase tracking-wider" htmlFor="new-password">New Password</label>
            <div className="relative bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden transition-all duration-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary-container/20">
              <input 
                id="new-password" 
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters" 
                className="w-full bg-transparent border-none py-4 px-4 text-on-surface focus:ring-0 focus:outline-none text-base placeholder:text-outline" 
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-outline-variant hover:text-primary">
                <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
              </button>
            </div>
            
            {/* Strength Indicator */}
            <div className="pt-2">
              <div className="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-300 ${strengthColor}`} style={{ width: \`\${strength}%\` }}></div>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className={\`text-xs font-medium \${strengthTextColor}\`}>Strength: {strengthText}</span>
                <div className="flex gap-1 items-center">
                  <span className={\`material-symbols-outlined text-[14px] \${password.length >= 8 ? 'text-primary' : 'text-outline-variant'}\`}>check_circle</span>
                  <span className="text-xs font-medium text-on-surface-variant">8+ chars</span>
                </div>
              </div>
            </div>
          </div>

          {/* Confirm Password Input */}
          <div className="space-y-2">
            <label className="font-bold text-xs text-on-surface-variant uppercase tracking-wider" htmlFor="confirm-password">Confirm Password</label>
            <div className="relative bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden transition-all duration-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary-container/20">
              <input 
                id="confirm-password" 
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password" 
                className="w-full bg-transparent border-none py-4 px-4 text-on-surface focus:ring-0 focus:outline-none text-base placeholder:text-outline" 
                required
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-outline-variant hover:text-primary">
                <span className="material-symbols-outlined">{showConfirm ? 'visibility_off' : 'visibility'}</span>
              </button>
            </div>
          </div>

          {/* Security Tip */}
          <div className="mt-10 p-6 bg-secondary-container rounded-2xl flex items-center gap-6">
            <div className="flex-shrink-0 w-12 h-12 bg-white rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
            </div>
            <div>
              <h4 className="font-bold text-xs text-on-secondary-container mb-1">Security Tip</h4>
              <p className="text-xs text-on-secondary-container opacity-80">Avoid using common words or birthdays in your password.</p>
            </div>
          </div>
        </form>
      </main>

      {/* Bottom Action Bar */}
      <footer className="fixed bottom-0 w-full z-50 flex justify-between items-center px-5 py-6 bg-surface shadow-[0_-8px_30px_rgb(0,0,0,0.12)] rounded-t-xl md:static md:max-w-md md:mx-auto md:shadow-none md:bg-transparent">
        <div className="flex flex-col">
          <span className="text-xs font-medium text-on-surface-variant">Step 2 of 2</span>
          <span className="text-xs font-bold text-primary">Security Update</span>
        </div>
        <button onClick={handleSubmit} disabled={loading} className="flex items-center justify-center bg-primary text-on-primary rounded-full px-6 h-14 hover:brightness-110 active:scale-90 duration-200 gap-2 group">
          <span className="font-bold text-sm">{loading ? 'Saving...' : 'Reset and Login'}</span>
          {loading ? <span className="material-symbols-outlined animate-spin">sync</span> : <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>}
        </button>
      </footer>
    </div>
  );
}
