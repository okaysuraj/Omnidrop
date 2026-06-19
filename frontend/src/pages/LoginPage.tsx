import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (user) {
      navigate(user.role === "seller" ? "/seller" : "/");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col">
      {/* TopNavBar */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-4 md:px-10 h-16 max-w-container-max mx-auto bg-surface-container-lowest dark:bg-surface-container-lowest border-b border-outline-variant dark:border-outline">
        <div className="flex items-center gap-8">
          <Link className="font-headline-md text-headline-md font-bold text-primary dark:text-primary-fixed-dim" to="/">Omnidrop</Link>
          <nav className="hidden md:flex gap-6">
            <Link className="font-label-md text-label-md text-on-surface-variant dark:text-on-surface-variant hover:text-primary dark:hover:text-primary-fixed-dim transition-colors" to="/#organic">Organic</Link>
            <Link className="font-label-md text-label-md text-on-surface-variant dark:text-on-surface-variant hover:text-primary dark:hover:text-primary-fixed-dim transition-colors" to="/#keto">Keto</Link>
            <Link className="font-label-md text-label-md text-on-surface-variant dark:text-on-surface-variant hover:text-primary dark:hover:text-primary-fixed-dim transition-colors" to="/#vegan">Vegan</Link>
            <Link className="font-label-md text-label-md text-on-surface-variant dark:text-on-surface-variant hover:text-primary dark:hover:text-primary-fixed-dim transition-colors" to="/#supplements">Supplements</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link className="hidden md:block font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" to="/login">Log In</Link>
          <Link to="/register" className="bg-primary-container text-on-primary-container px-6 py-2 rounded-full font-label-md text-label-md font-bold hover:opacity-90 active:scale-95 transition-all">Sign Up</Link>
        </div>
      </header>
      {/* Login Main Section */}
      <main className="flex-grow flex items-stretch pt-16">
        {/* Left: Image Section */}
        <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/10 mix-blend-multiply z-10"></div>
          <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('/login_hero.png')" }}></div>
          <div className="absolute bottom-16 left-16 z-20 max-w-md">
            <h1 className="font-headline-xl text-headline-xl text-white mb-4">Fuel your day, faster.</h1>
            <p className="font-body-lg text-body-lg text-white/90">Join the thousands optimizing their performance with nature's best delivered in under 15 minutes.</p>
          </div>
        </div>
        {/* Right: Form Section */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 bg-white">
          <div className="w-full max-w-md space-y-stack-lg">
            <div className="space-y-stack-sm">
              <h2 className="font-headline-lg text-headline-lg text-on-surface">Welcome back</h2>
              <p className="text-on-surface-variant font-body-md">Please enter your details to sign in.</p>
            </div>
            <form className="space-y-stack-lg" onSubmit={handleSubmit}>
              <div className="space-y-stack-sm">
                <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="email">Email</label>
                <div className="form-glow">
                  <input 
                    className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-white focus:border-primary focus:ring-0 transition-all outline-none font-body-md" 
                    id="email" 
                    name="email" 
                    placeholder="name@omnidrop.com" 
                    required 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-stack-sm">
                <div className="flex justify-between items-center">
                  <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="password">Password</label>
                  <a className="text-primary font-label-md text-label-md hover:underline" href="#">Forgot Password?</a>
                </div>
                <div className="form-glow">
                  <input 
                    className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-white focus:border-primary focus:ring-0 transition-all outline-none font-body-md" 
                    id="password" 
                    name="password" 
                    placeholder="••••••••" 
                    required 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary" id="remember" type="checkbox" />
                <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="remember">Remember me for 30 days</label>
              </div>
              <button className="w-full py-4 bg-primary text-on-primary font-label-md text-label-md rounded-lg hover:opacity-90 active:scale-[0.98] transition-all flex justify-center items-center gap-2" type="submit">
                Sign In
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_forward</span>
              </button>
            </form>
            <div className="relative py-4 flex items-center">
              <div className="flex-grow border-t border-outline-variant"></div>
              <span className="flex-shrink mx-4 text-on-surface-variant font-label-md text-label-md">Or continue with</span>
              <div className="flex-grow border-t border-outline-variant"></div>
            </div>
            <div className="grid grid-cols-2 gap-gutter">
              <button className="flex items-center justify-center gap-3 py-3 border-2 border-outline-variant rounded-lg font-label-md text-label-md text-on-surface hover:bg-surface-container-low transition-colors active:scale-95">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor"></path>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor"></path>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="currentColor"></path>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="currentColor"></path>
                </svg>
                Google
              </button>
              <button className="flex items-center justify-center gap-3 py-3 border-2 border-outline-variant rounded-lg font-label-md text-label-md text-on-surface hover:bg-surface-container-low transition-colors active:scale-95">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12c0-5.523-4.477-10-10-10z" fill="currentColor"></path>
                </svg>
                Facebook
              </button>
            </div>
            <p className="text-center font-body-md text-on-surface-variant pt-4">
              Don't have an account?
              <Link className="text-primary font-bold hover:underline ml-1" to="/register">Create an account</Link>
            </p>
          </div>
        </div>
      </main>
      {/* Footer */}
      <footer className="w-full py-12 px-4 md:px-10 grid grid-cols-2 md:grid-cols-4 gap-gutter bg-surface-container-low dark:bg-surface-container-low">
        <div className="col-span-2 md:col-span-1 space-y-stack-md">
          <span className="font-headline-md text-headline-md font-bold text-primary dark:text-primary-fixed-dim">Omnidrop</span>
          <p className="font-body-md text-on-surface-variant max-w-xs">© 2024 Omnidrop. Your wellness, delivered fast.</p>
        </div>
        <div className="flex flex-col gap-3">
          <span className="font-label-md text-label-md font-bold text-primary">Shop</span>
          <a className="font-body-md text-on-surface-variant hover:text-secondary transition-colors" href="#">Organic</a>
          <a className="font-body-md text-on-surface-variant hover:text-secondary transition-colors" href="#">Keto</a>
          <a className="font-body-md text-on-surface-variant hover:text-secondary transition-colors" href="#">Vegan</a>
          <a className="font-body-md text-on-surface-variant hover:text-secondary transition-colors" href="#">Gluten-Free</a>
        </div>
        <div className="flex flex-col gap-3">
          <span className="font-label-md text-label-md font-bold text-primary">Support</span>
          <a className="font-body-md text-on-surface-variant hover:text-secondary transition-colors" href="#">Help Center</a>
          <a className="font-body-md text-on-surface-variant hover:text-secondary transition-colors" href="#">Privacy Policy</a>
          <a className="font-body-md text-on-surface-variant hover:text-secondary transition-colors" href="#">Terms of Service</a>
        </div>
        <div className="flex flex-col gap-4">
          <span className="font-label-md text-label-md font-bold text-primary">Follow Us</span>
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center text-primary cursor-pointer hover:bg-primary-container/40 transition-colors">
              <span className="material-symbols-outlined">camera</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center text-primary cursor-pointer hover:bg-primary-container/40 transition-colors">
              <span className="material-symbols-outlined">share</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
