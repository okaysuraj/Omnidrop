export function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[921px] flex items-center overflow-hidden bg-surface-bright">
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none"></div>
        <div className="container mx-auto px-margin-mobile md:px-margin-desktop grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div className="max-w-xl">
            <span className="inline-block px-3 py-1 bg-secondary-container text-on-secondary-container font-label-sm text-label-sm rounded-full mb-stack-lg uppercase tracking-widest">Wellness Delivered Fast</span>
            <h1 className="font-headline-xl text-headline-xl text-on-surface mb-stack-lg">Healthy Living, Delivered in <span className="text-primary">15 Minutes.</span></h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-10 leading-relaxed">The highest quality organic produce, keto essentials, and premium supplements delivered to your doorstep at the speed of life. Pure. Fast. Reliable.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-primary text-on-primary font-label-md text-label-md px-10 py-4 rounded-full shadow-lg hover:opacity-90 transition-all">Start Shopping</button>
              <button className="border-2 border-primary text-primary font-label-md text-label-md px-10 py-4 rounded-full hover:bg-primary/5 transition-all flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">play_circle</span>
                How it works
              </button>
            </div>
            <div className="mt-12 flex items-center gap-6">
              <div className="flex -space-x-3">
                <div className="w-10 h-10 rounded-full border-2 border-white bg-cover bg-center" data-alt="Close up portrait of a smiling young woman with healthy glowing skin and athletic wear, representing a satisfied wellness customer, against a soft natural daylight background. The aesthetic is clean and high-key." style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCt0tg-1KvHf374j2Gx8bSLujCSkG90qnupO8LR7PAOyYPp8mT6ffx0bbECMBf61KjtVwwwWkTs5Vn3cEcycfTwMGzFvvOg12Gn_viALVQtGAVkK8TeHKhdyWCpOfGtvvoktVy-5nz8LWDXlPSOeE-HoSwW3qoLAAtFCONvsExMpBVqn4lqgRfELJkF-0_iG4qWn6cHWLaeHVbIuRTzT5S1pazvKVlR8eyGEBw9hVz2dLzY016_Y9OeAf0r9-qMSKjViTTBUHsKPvms')" }}></div>
                <div className="w-10 h-10 rounded-full border-2 border-white bg-cover bg-center" data-alt="A portrait of a fit middle-aged man in sports gear smiling warmly, embodying health and vitality. The background is a blurred minimalist fitness studio with soft green lighting accents, maintaining a professional corporate wellness aesthetic." style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD9OGdvpUUh52GdVcFu4ghhCaEAsWevsz6-hByzDH1zfQDCuDnlrSytbt037D3NMTNHPkNBERtD7rn-kmFqQLl0AYF5HWik5pp8JXw-YkUSYVFryYFzXvXLU4sTJkcmY3r1njdfwHygWLfJlL_0C1HhslGGTCMyzEybniqPsXkvDK_ZkU9QGSkGqlH4K6pr-itZT1dQikk4Z3uTVo-WNWO4Wt65ke9snyavv1WhnGc1I8Ju1bkoyW27XStPSkhnnLih4aHQhgYDiw2m')" }}></div>
                <div className="w-10 h-10 rounded-full border-2 border-white bg-cover bg-center" data-alt="A diverse young man with an active lifestyle looking confidently at the camera, wearing premium athleisure. The environment is a modern, sunlit kitchen with fresh green plants in the background, signaling health and home wellness." style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAeoKr0L3kVRxSkS0YAk112kPuWVCukhVjIi2Dy0871_3ZSSXxJHkS_VDiLRy6DzsraB7nVRooQk4gsqql2ZpoxRmBtGeVTKctS3TI9gpLSHzzoEXTi1qXcSUKEegCpz82-S_qJL54axqJPfazhpN6hZROl6jtauYNjuByowyO_WJR3Mcrwv_0_3vUPKGUv1WDsZR7B5KTXKmi_iQAm5z3w59PxOoW84_wDBlPF-iDN-M-o4pUswWhXPQpSna1Ysq8DN1wzf_BSO1Qu')" }}></div>
              </div>
              <p className="font-label-sm text-label-sm text-on-surface-variant"><span className="font-bold text-on-surface">10,000+</span> Health enthusiasts joined this month</p>
            </div>
          </div>
          <div className="relative hidden md:block">
            <div className="relative z-20 animate-float">
              <img className="w-full h-auto rounded-3xl premium-shadow" data-alt="A high-end, professionally styled composition of a wooden crate overflowing with vibrant, fresh organic vegetables like kale, bright tomatoes, and avocados, next to a premium dark-glass supplement bottle. The lighting is crisp and clean, like a high-fashion food photography shoot, set against a minimalist white and mint green background." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLn5JCZy76k8SQYjT3BzoxX3Q75m6ZDKBx3iIjnt1piJGhH74yyPi91Y4JZF08lnUtvwq6j1PBb8W6GEBdcA2pMHAOJi4d8oEy76PwxOuvP0jGlBNYGgPT0H63azZ_QsfoOjC0Tgg0M0LQahFHSqvuS72KGv_Fk68ljFL1fo5vB-qVZj2J1nJYEF7xm6Zx5eCFlFCCttPjcH12BQhEHsJqPqP4cLG1OB_L-uSP1iEKjS3wvCnaVF7TJHjm_Lhli4IX3LAKmpjPktrJ" />
            </div>
            {/* Floating Badge */}
            <div className="absolute -bottom-6 -left-6 z-30 glass-card p-6 rounded-2xl flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-container rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-on-primary-container">speed</span>
              </div>
              <div>
                <p className="font-label-md text-label-md text-on-surface">Average Delivery</p>
                <p className="font-headline-md text-headline-md text-primary font-bold">14:22 min</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Bento Grid */}
      <section className="py-24 bg-white" id="categories">
        <div className="container mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="font-headline-lg text-headline-lg text-on-surface">Curated for Your Lifestyle</h2>
              <p className="text-on-surface-variant mt-2">Expertly sourced selections for every dietary need.</p>
            </div>
            <a className="text-primary font-label-md text-label-md flex items-center gap-2 hover:underline" href="#">
              View All Categories <span className="material-symbols-outlined">arrow_forward</span>
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[600px]">
            <div className="md:col-span-8 group relative overflow-hidden rounded-3xl cursor-pointer">
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" data-alt="A breathtaking close-up of dew-covered organic heirloom tomatoes and dark green kale leaves. The lighting highlights the natural textures and vibrant colors. The style is minimalist and clean, with a focus on purity and health, using a soft primary green and white palette." style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCH5oSkskBUCRD8n-2IetYADNVZ9YWviqnA36Lkcv3QC1S5MmYXRfQ_FOeA2uWbzYmQmiR8tOaFJ5iNbAV6rvXTVeFB0Q87F13hSbdYooXstmnAqzAgUeieqNApntJxnnGI5C7qRt7Nvqey2gg4e4-XITmiLaRo8ITCsVZxjAXfDoB8dhI5PzH1klvcA4NRJpUsNfCrmYwv3RbWoY_8tZF3EnSTqtfXUvLO-fWThn1DOfzAGOhz0yyjtmbeQ5K3Vb0NYtCIJnPbJccv')" }}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-8 left-8 text-white">
                <h3 className="font-headline-md text-headline-md" id="organic">Organic Produce</h3>
                <p className="opacity-90 font-label-md">Farm-to-table freshness, pesticide-free.</p>
              </div>
            </div>
            <div className="md:col-span-4 group relative overflow-hidden rounded-3xl cursor-pointer">
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" data-alt="Minimalist flat lay of keto-friendly foods including halved avocados, salmon, and walnuts on a stone surface. The aesthetic is clinical and high-end, emphasizing transparency and nutritional quality. Lighting is bright and even, perfect for a modern health brand." style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBxn63woKUeyNTVaW_sfW1JpFmdSqU9YOxNNAo6ML_jotYqc1kifmn7tbLxuvVlvs-yoF1wyieDCskSk1vgUTkGXcjaTSd2aSpz9d_T7-JIsRjgp3QTT9aebCk2DTVcuHaiPFaQPy9Vi0Hq5iXDH9DKQLZLLFD8wyk7nLe2wnJUc_qUEe_OWAFHbVazFQdp_xj5Q-ejaUHpcysfLarkPMYHUNuz6sDXnYbHb28QVIdW-U562hYivzg160vNWp_cy6e8TgZG5MifpV8g')" }}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-8 left-8 text-white">
                <h3 className="font-headline-md text-headline-md" id="keto">Keto Essentials</h3>
                <p className="opacity-90 font-label-md">High-fat, low-carb perfection.</p>
              </div>
            </div>
            <div className="md:col-span-4 group relative overflow-hidden rounded-3xl cursor-pointer">
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" data-alt="A clean, minimalist arrangement of vibrant plant-based protein sources like chickpeas, edamame, and colorful quinoa. The composition is artistic and structured, using a mint and white color theme to evoke freshness and vitality for a vegan audience." style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD2mX03I8jRsna51CuV7RAJsr26Xgeu7M6OyXznttFiUTrQ89-Rt9O3kayqgHvxM1yNwkXejGtalv3QcPDATTYwjO0sD2JezcpEOOkLl0GFJCjoWEuYOBkOw1Y9AtFuTe3vJob1MebxtOvn3HwG2w44f6k5Y0vTVfmAwdydvT9L8mIGm2veF3zrlkNBXc75iWzCdAOsOx86K1-1TSbj68o6ew6c7VENDmOSnMFmOg-jZkhCR5_fd1_Wt4x-1oc5VlqwDOhbsHjFf5Us')" }}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-8 left-8 text-white">
                <h3 className="font-headline-md text-headline-md" id="vegan">Vegan Selection</h3>
                <p className="opacity-90 font-label-md">100% plant-powered nutrients.</p>
              </div>
            </div>
            <div className="md:col-span-8 group relative overflow-hidden rounded-3xl cursor-pointer">
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" data-alt="High-end studio shot of sleek dark glass supplement bottles and aesthetic glass droppers arranged on a marble surface. Soft sunlight creates elegant shadows. The visual style is premium, clinical yet approachable, emphasizing the high standards of a health boutique." style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB9Yu5rELGnlanxvnTfCpyW8UUdgWLwfVxnnuV-I5VrlH2-zCbeqOm-Pqn4z7LwQt5ODb5lnMTi2vqKkmU9mYn9XHW97Jf8roaIMJbg-c2AE-9HnHYAOA_ZjemLp410baOFv9_NTPfFSp2hVZ0I4L5uaze9-Szk99LOmTtz893EBWHa5elCesPaQXH6V-n7WT5OHqsTSaxjlHpwFaSgT5cUqgxQI8IBkf_RDnsc3LbvICkgQOFpvqDjWjiuqlL1c0NVaKrbxGl8XT6z')" }}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-8 left-8 text-white">
                <h3 className="font-headline-md text-headline-md" id="supplements">Premium Supplements</h3>
                <p className="opacity-90 font-label-md">Optimized for your peak performance.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-surface-container-low">
        <div className="container mx-auto px-margin-mobile md:px-margin-desktop text-center">
          <h2 className="font-headline-lg text-headline-lg mb-16">The Omnidrop Experience</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-6 premium-shadow">
                <span className="material-symbols-outlined text-primary text-4xl">search_spark</span>
              </div>
              <h4 className="font-headline-md text-headline-md mb-2">1. Browse</h4>
              <p className="text-on-surface-variant max-w-xs">Explore our curated selection of lab-tested wellness products and organic foods.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-6 premium-shadow">
                <span className="material-symbols-outlined text-primary text-4xl">shopping_cart_checkout</span>
              </div>
              <h4 className="font-headline-md text-headline-md mb-2">2. Order</h4>
              <p className="text-on-surface-variant max-w-xs">Seamless checkout with flexible payment options. Subscriptions available for essentials.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-6 premium-shadow">
                <span className="material-symbols-outlined text-primary text-4xl">bolt</span>
              </div>
              <h4 className="font-headline-md text-headline-md mb-2">3. 15-min Delivery</h4>
              <p className="text-on-surface-variant max-w-xs">Our riders are already nearby. Receive your wellness kit while it's still fresh.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-margin-mobile md:px-margin-desktop">
          <h2 className="font-headline-lg text-headline-lg text-center mb-16">Trusted by Health Enthusiasts</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="glass-card p-8 rounded-3xl flex flex-col justify-between">
              <div>
                <div className="flex gap-1 text-primary mb-4">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                </div>
                <p className="font-body-md text-on-surface italic">"Omnidrop changed the game for my keto lifestyle. Getting fresh avocados and high-quality MCT oil in under 20 minutes is a lifesaver when I'm busy."</p>
              </div>
              <div className="flex items-center gap-4 mt-8">
                <div className="w-12 h-12 rounded-full bg-cover bg-center" data-alt="Portrait of a young athletic woman with a ponytail, smiling brightly in a light-filled modern gym setting. High-key, clean aesthetic." style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAwcRVCvfqeZth_GQbVUO_mA0PmIJ49FuESEH6Rqpcb5KiRchBThG-O3EZ7UvW5jovFLGYrfJ9UyWinXzMj8mQuXNk-l2hG0md-5OlXOF4pAfl1bbBq04XMj0-JXeXhWmGPTro_QcZorLATMgcooCQQbBGtHm7_jlvg_INtD-xnU4poN7PUetW53z9ztQfzwIoDV6AVq7ZNWu9zY7W25dE4YypR-n6_QFem7tdLPlfgibhkTbWdIOQpWxEID9SWLmvGYcNJsTmmkeQk')" }}></div>
                <div>
                  <p className="font-label-md text-on-surface">Sarah J.</p>
                  <p className="text-label-sm text-on-surface-variant">Fitness Coach</p>
                </div>
              </div>
            </div>
            {/* Testimonial 2 */}
            <div className="glass-card p-8 rounded-3xl flex flex-col justify-between">
              <div>
                <div className="flex gap-1 text-primary mb-4">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                </div>
                <p className="font-body-md text-on-surface italic">"The quality of the organic produce is better than what I find at my local high-end grocery store. Plus, the 15-minute delivery is actually 15 minutes."</p>
              </div>
              <div className="flex items-center gap-4 mt-8">
                <div className="w-12 h-12 rounded-full bg-cover bg-center" data-alt="Portrait of a professional man in a crisp white shirt, looking healthy and energized in a minimalist office with plants. Modern corporate style." style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA3fgvT6OL8yqhKRZwn8GekxEzI3C2eIYjVodlPf0X3U0uL3RRqShbvBjpU8IMLbHZEbhwK-mzSgQ6JXhotCjEDEZkLVRN4AhA5rUQ3HPBBlqsPSeYxwBy4vGVbAyZu4sRxPxbrfNs6qmR8L_mEWbh2eK2gh5YIVPkuFSw4zIgI87bKha1X8y7PrFS-B4oxQn6so1_LGIuwTfxq_4bNXOet7kvIj-l6L_zrkf0uED_gdn9zzK52piyeZfuvsoAPzfu03kVnJZ-FgveT')" }}></div>
                <div>
                  <p className="font-label-md text-on-surface">David M.</p>
                  <p className="text-label-sm text-on-surface-variant">Tech Executive</p>
                </div>
              </div>
            </div>
            {/* Testimonial 3 */}
            <div className="glass-card p-8 rounded-3xl flex flex-col justify-between">
              <div>
                <div className="flex gap-1 text-primary mb-4">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                </div>
                <p className="font-body-md text-on-surface italic">"As a vegan, I often struggle to find specific supplements. Omnidrop always has them in stock. It’s my go-to for keeping my health on track."</p>
              </div>
              <div className="flex items-center gap-4 mt-8">
                <div className="w-12 h-12 rounded-full bg-cover bg-center" data-alt="Portrait of a young man with a serene expression, wearing comfortable linen clothing in a sun-drenched minimalist living room. Holistic wellness aesthetic." style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBxP44Mj_JJhoWoHpY12cDDLSiCoLhvqt0YaqaDCSE2wUV2gpuycHrF2n78JQfZ9ts6Y5qL42k8JEhro8PiJS8UhkuR2unrBl69eCW_HwaQCNUj5QOJ40W7Zew9ZK9PVStLU1BjZLHXy0BybQJW92_Sox_eHWN6lX4a8jDvrmx3Jf31R2E0-a7OSVkQxlFrNjf6U358nvIIy_vHrWOVwZew8hCiAaxd0_PFMA-AJVinhZp5pB6tHpNeTLTXDcE6oLFR4Y7fE02nE48o')" }}></div>
                <div>
                  <p className="font-label-md text-on-surface">Elena R.</p>
                  <p className="text-label-sm text-on-surface-variant">Yoga Instructor</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 z-0"></div>
        <div className="container mx-auto px-margin-mobile md:px-margin-desktop relative z-10">
          <div className="max-w-4xl mx-auto glass-card p-12 md:p-16 rounded-[40px] text-center">
            <h2 className="font-headline-lg text-headline-lg mb-6">Expert Nutrition Tips to Your In-box</h2>
            <p className="font-body-lg text-on-surface-variant mb-10 max-w-2xl mx-auto">Join 50,000+ subscribers and get weekly curated wellness content, exclusive discounts, and new product alerts.</p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto" onSubmit={(e) => { e.preventDefault(); alert('Subscribed!'); }}>
              <input className="flex-grow px-6 py-4 rounded-full border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="Enter your email" required type="email" />
              <button className="bg-primary text-on-primary font-label-md text-label-md px-10 py-4 rounded-full shadow-lg hover:opacity-90 transition-all whitespace-nowrap" type="submit">Subscribe Now</button>
            </form>
            <p className="text-label-sm text-on-surface-variant mt-6">By subscribing, you agree to our <a className="underline" href="#">Privacy Policy</a>.</p>
          </div>
        </div>
      </section>
    </>
  );
}
