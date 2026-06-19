import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export function RegisterPage() {
  const { register, user } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  useEffect(() => {
    if (user) {
      navigate(user.role === "seller" ? "/seller" : "/");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(email, password, fullName, role);
    } catch (err) {
      console.error("Registration failed", err);
    }
  };

  useEffect(() => {
    const features = document.querySelectorAll('.feature-card');
    features.forEach((el: any, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        el.style.transitionDelay = `${index * 150}ms`;
        
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 100);
    });
  }, []);

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-margin-mobile md:px-margin-desktop h-16 max-w-container-max mx-auto bg-surface-container-lowest border-b border-outline-variant">
        <div className="flex items-center gap-8">
          <Link className="font-headline-md text-headline-md font-bold text-primary" to="/">Omnidrop</Link>
          <nav className="hidden md:flex gap-6 items-center">
            <Link className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" to="/#organic">Organic</Link>
            <Link className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" to="/#keto">Keto</Link>
            <Link className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" to="/#vegan">Vegan</Link>
            <Link className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" to="/#supplements">Supplements</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" to="/login">Log In</Link>
          <Link to="/register" className="bg-primary-container text-on-primary-container px-6 py-2 rounded-full font-label-md text-label-md font-bold hover:opacity-90 active:scale-95 transition-all">Sign Up</Link>
        </div>
      </header>

      {/* Main Content: Signup Journey */}
      <main className="flex-grow pt-24 pb-stack-lg px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center">
        {/* Left Side: Wellness Branding / Visual */}
        <div className="hidden lg:flex lg:col-span-6 flex-col gap-stack-lg pr-12">
          <div className="space-y-4">
            <h1 className="font-headline-xl text-headline-xl text-on-surface leading-tight">
              Elevate Your <span className="text-primary">Vitality</span> With Every Delivery.
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              Join a community of 50,000+ wellness enthusiasts getting high-quality, nutrition-focused groceries delivered in minutes.
            </p>
          </div>
          {/* Features Bento-ish Layout */}
          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="feature-card p-6 bg-surface-container-low rounded-xl border border-outline-variant flex flex-col gap-2">
              <span className="material-symbols-outlined text-primary text-3xl">verified_user</span>
              <h3 className="font-headline-md text-headline-md text-sm">Clinical Standards</h3>
              <p className="font-body-md text-sm text-on-surface-variant">Strictly vetted organic and non-GMO brands.</p>
            </div>
            <div className="feature-card p-6 bg-secondary-container/20 rounded-xl border border-secondary-container flex flex-col gap-2">
              <span className="material-symbols-outlined text-secondary text-3xl">bolt</span>
              <h3 className="font-headline-md text-headline-md text-sm">Active Speed</h3>
              <p className="font-body-md text-sm text-on-surface-variant">Rapid delivery to keep your momentum going.</p>
            </div>
          </div>
          {/* Animated Decorative Element */}
          <div className="feature-card relative w-full aspect-video rounded-2xl overflow-hidden mt-8 border border-outline-variant">
            <div className="absolute inset-0 bg-cover bg-center" data-alt="A serene, high-end close-up photograph of vibrant fresh organic greens and citrus fruits resting on a clean white marble countertop. The lighting is bright and airy with soft shadows, creating a high-key minimalist health boutique aesthetic. Subtle depth of field emphasizes textures of kale leaves and water droplets on a sliced lemon. Deep greens and bright yellows pop against the clinical white background." style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBNytXKYwylyqZGX1TYZlwpV3Fi9DlXr5tRZMHbVqKxqn61WHWAxf2jd14KFNkPEu2oXt-mZZjmeX9-2OtKtx_ZUgVgES6NwGAZ-c2UxKp186SXP-kUvlxvzmxBemmZR03sZjnVmDO9ckh0UP9gJ6bRAOpWBS3akTAsrIZ7oW_xQ4IqQmuPuYMbQmlpPNjAYunnfxpnhDQJU8SqeOOM-D0NprnvSrI3inc6VgTZRt5KuyELGyKU3shjITbCa7jDdqLV2MWJbhuDdVLW')" }}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent flex items-end p-8">
              <div className="glass-effect p-4 rounded-lg flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-primary-fixed-variant">eco</span>
                </div>
                <div>
                  <p className="font-label-md text-on-surface font-bold">100% Certified Organic</p>
                  <p className="font-label-sm text-on-surface-variant">Locally sourced &amp; sustainable</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Right Side: Signup Form */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-2xl border border-outline-variant">
            <div className="text-center mb-stack-lg">
              <h2 className="font-headline-lg text-headline-lg text-on-surface">Start Your Journey</h2>
              <p className="font-body-md text-on-surface-variant mt-2">Create your account to unlock personalized wellness.</p>
            </div>
            {/* Social Signups */}
            <div className="grid grid-cols-2 gap-4 mb-stack-lg">
              <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-outline-variant font-label-md hover:bg-surface-container transition-colors active:scale-95">
                <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path></svg>
                Google
              </button>
              <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-outline-variant font-label-md hover:bg-surface-container transition-colors active:scale-95">
                <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-.5-.24-1.03-.6-1.7-.62-.67-.02-1.2.34-1.72.62-1.2.65-2.08.45-3-.42-3.8-3.83-3.2-10.4 1.25-10.3 1.2.03 1.95.73 2.7.73.74 0 1.63-.82 2.97-.68 1.15.12 2.03.58 2.63 1.45-2.4 1.44-1.8 4.6.63 5.58-.5 1.26-1.15 2.5-2.18 3.54zm-2.85-15.5c-.32-2.58 1.93-4.8 4.43-4.78.24 2.76-2.1 5.1-4.43 4.78z"></path></svg>
                Apple
              </button>
            </div>
            <div className="relative flex items-center justify-center mb-stack-lg">
              <div className="border-t border-outline-variant w-full"></div>
              <span className="absolute bg-white px-4 font-label-sm text-on-surface-variant uppercase tracking-widest">Or email</span>
            </div>
            {/* Form Fields */}
            <form className="flex flex-col gap-stack-md" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-stack-sm form-group">
                <label className="font-label-md text-label-md text-on-surface transition-colors duration-200" htmlFor="full_name">Full Name</label>
                <input 
                  className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-primary transition-all bg-white" 
                  id="full_name" 
                  placeholder="John Doe" 
                  type="text" 
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  onFocus={(e) => e.target.parentElement?.querySelector('label')?.classList.add('text-primary')}
                  onBlur={(e) => e.target.parentElement?.querySelector('label')?.classList.remove('text-primary')}
                />
              </div>
              <div className="flex flex-col gap-stack-sm form-group">
                <label className="font-label-md text-label-md text-on-surface transition-colors duration-200" htmlFor="email">Email Address</label>
                <input 
                  className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-primary transition-all bg-white" 
                  id="email" 
                  placeholder="john@example.com" 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={(e) => e.target.parentElement?.querySelector('label')?.classList.add('text-primary')}
                  onBlur={(e) => e.target.parentElement?.querySelector('label')?.classList.remove('text-primary')}
                />
              </div>
              <div className="flex flex-col gap-stack-sm form-group">
                <label className="font-label-md text-label-md text-on-surface transition-colors duration-200" htmlFor="password">Password</label>
                <input 
                  className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-primary transition-all bg-white" 
                  id="password" 
                  placeholder="••••••••" 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={(e) => e.target.parentElement?.querySelector('label')?.classList.add('text-primary')}
                  onBlur={(e) => e.target.parentElement?.querySelector('label')?.classList.remove('text-primary')}
                />
              </div>
              {/* Dietary Preferences */}
              <div className="mt-4">
                <span className="font-label-md text-label-md text-on-surface block mb-3">Dietary Preferences</span>
                <div className="flex flex-wrap gap-2">
                  <label className="cursor-pointer">
                    <input className="hidden peer" name="diet" type="checkbox" value="organic" />
                    <span className="px-4 py-2 rounded-full border border-outline-variant font-label-sm text-on-surface-variant peer-checked:bg-secondary-container peer-checked:text-on-secondary-container peer-checked:border-secondary transition-all block">Organic</span>
                  </label>
                  <label className="cursor-pointer">
                    <input className="hidden peer" name="diet" type="checkbox" value="keto" />
                    <span className="px-4 py-2 rounded-full border border-outline-variant font-label-sm text-on-surface-variant peer-checked:bg-secondary-container peer-checked:text-on-secondary-container peer-checked:border-secondary transition-all block">Keto</span>
                  </label>
                  <label className="cursor-pointer">
                    <input className="hidden peer" name="diet" type="checkbox" value="vegan" />
                    <span className="px-4 py-2 rounded-full border border-outline-variant font-label-sm text-on-surface-variant peer-checked:bg-secondary-container peer-checked:text-on-secondary-container peer-checked:border-secondary transition-all block">Vegan</span>
                  </label>
                  <label className="cursor-pointer">
                    <input className="hidden peer" name="diet" type="checkbox" value="gluten-free" />
                    <span className="px-4 py-2 rounded-full border border-outline-variant font-label-sm text-on-surface-variant peer-checked:bg-secondary-container peer-checked:text-on-secondary-container peer-checked:border-secondary transition-all block">Gluten-Free</span>
                  </label>
                </div>
              </div>
              {/* Role Selection */}
              <div className="flex flex-col gap-stack-sm form-group mb-2">
                <span className="font-label-md text-label-md text-on-surface">I want to</span>
                <div className="flex gap-4">
                  <label className="flex-1 cursor-pointer">
                    <input 
                      type="radio" 
                      name="role" 
                      value="user" 
                      className="hidden peer"
                      checked={role === "user"}
                      onChange={(e) => setRole(e.target.value)}
                    />
                    <div className="p-3 text-center rounded-xl border border-outline-variant peer-checked:border-primary peer-checked:bg-primary/5 transition-all text-on-surface-variant peer-checked:text-primary font-label-md">
                      Buy Groceries
                    </div>
                  </label>
                  <label className="flex-1 cursor-pointer">
                    <input 
                      type="radio" 
                      name="role" 
                      value="seller" 
                      className="hidden peer"
                      checked={role === "seller"}
                      onChange={(e) => setRole(e.target.value)}
                    />
                    <div className="p-3 text-center rounded-xl border border-outline-variant peer-checked:border-primary peer-checked:bg-primary/5 transition-all text-on-surface-variant peer-checked:text-primary font-label-md">
                      Sell Products
                    </div>
                  </label>
                </div>
              </div>
              
              <button className="w-full mt-6 py-4 bg-primary text-on-primary font-label-md text-lg rounded-xl shadow-lg shadow-primary-container/30 active:scale-[0.98] transition-transform hover:bg-primary/90" type="submit">
                Create Account
              </button>
              <p className="text-center font-label-sm text-on-surface-variant mt-4">
                By signing up, you agree to our <Link className="text-primary underline" to="/">Terms</Link> and <Link className="text-primary underline" to="/">Privacy Policy</Link>.
              </p>
            </form>
          </div>
        </div>
      </main>
      {/* Footer */}
      <footer className="w-full py-stack-lg px-margin-desktop grid grid-cols-2 md:grid-cols-4 gap-gutter bg-surface-container-low mt-auto">
        <div className="col-span-2 md:col-span-1 space-y-4">
          <span className="font-headline-md text-headline-md font-bold text-primary">Omnidrop</span>
          <p className="font-body-md text-label-md text-on-surface-variant leading-relaxed">
            © 2024 Omnidrop. Your wellness, delivered fast.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <h4 className="font-label-md text-primary font-bold">Categories</h4>
          <a className="font-label-md text-on-surface-variant hover:text-secondary transition-colors" href="#">Organic</a>
          <a className="font-label-md text-on-surface-variant hover:text-secondary transition-colors" href="#">Keto</a>
          <a className="font-label-md text-on-surface-variant hover:text-secondary transition-colors" href="#">Vegan</a>
          <a className="font-label-md text-on-surface-variant hover:text-secondary transition-colors" href="#">Gluten-Free</a>
        </div>
        <div className="flex flex-col gap-2">
          <h4 className="font-label-md text-primary font-bold">Support</h4>
          <a className="font-label-md text-on-surface-variant hover:text-secondary transition-colors" href="#">Help Center</a>
          <a className="font-label-md text-on-surface-variant hover:text-secondary transition-colors" href="#">Safety</a>
          <a className="font-label-md text-on-surface-variant hover:text-secondary transition-colors" href="#">Delivery Areas</a>
        </div>
        <div className="flex flex-col gap-2">
          <h4 className="font-label-md text-primary font-bold">Legal</h4>
          <a className="font-label-md text-on-surface-variant hover:text-secondary transition-colors" href="#">Privacy Policy</a>
          <a className="font-label-md text-on-surface-variant hover:text-secondary transition-colors" href="#">Terms of Service</a>
          <a className="font-label-md text-on-surface-variant hover:text-secondary transition-colors" href="#">Cookie Policy</a>
        </div>
      </footer>
    </div>
  );
}
