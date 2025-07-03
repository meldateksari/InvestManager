// TO-DO Sectionların içeriği güncellenecek


'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const HorizontalScroll = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<HTMLDivElement>(null);

  // Section sayısını buradan belirleyin
  const sectionCount = 4;

  useEffect(() => {
    let ctx = gsap.context(() => {
      const container = containerRef.current;
      const slides = slidesRef.current;
      
      if (!container || !slides) return;

      const slideWidth = window.innerWidth;
      const totalScrollDistance = slideWidth * (sectionCount - 1);

      // Ana horizontal scroll animasyonu
      gsap.to(slides, {
        x: () => -totalScrollDistance,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          pin: true,
          scrub: 1,
          start: "top top",
          end: () => `+=${totalScrollDistance}`,
          invalidateOnRefresh: true,
        }
      });

      // Section 1 için özel animasyonlar
      const section1Elements = {
        icon: document.querySelector('[data-section1-anim="icon"]'),
        title: document.querySelector('[data-section1-anim="title"]'),
        description: document.querySelector('[data-section1-anim="description"]')
      };

      if (section1Elements.icon && section1Elements.title && section1Elements.description) {
        // Timeline oluştur
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            start: "top top",
            end: () => `+=${slideWidth * 0.15}`, // İlk section'ın %30'unda tamamlansın
            scrub: 1,
          }
        });

        // Sırayla animasyonları ekle
        tl.to(section1Elements.icon, {
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: "power2.out"
        })
        .to(section1Elements.title, {
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: "power2.out"
        }, "-=0.1") // 0.1s önce başlasın
        .to(section1Elements.description, {
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: "power2.out"
        }, "-=0.1"); // 0.1s önce başlasın
      }

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative overflow-hidden min-h-screen">
      {/* Global background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10"></div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-radial from-blue-500/20 via-transparent to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-radial from-indigo-500/20 via-transparent to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Sections Container */}
      <div className="relative overflow-hidden">
        <div 
          ref={slidesRef} 
          className="flex will-change-transform"
          style={{ width: `${sectionCount * 100}vw` }}
        >
          
          {/* Section 1 - Kendi tasarımınızı buraya yazın */}
          <div className="flex-shrink-0 relative min-h-screen flex items-center" style={{ width: '100vw' }}>
            {/* Section 1 Background */}
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-800"></div>
              <div className="absolute inset-0 bg-black/20"></div>
            </div>

            {/* Section 1 Content - Buraya istediğiniz tasarımı yazın */}
            <div className="relative z-10 w-full px-8 md:px-16 lg:px-24">
              {/* Buraya Section 1 için özel kodunuzu yazın */}
              <div className="text-center max-w-4xl mx-auto">
                <div 
                  className="inline-block p-8 bg-white/10 backdrop-blur-sm rounded-3xl mb-8 opacity-0 translate-y-[-50px]"
                  data-section1-anim="icon"
                >
                  <div className="text-8xl">🎯</div>
                </div>
                <h3 
                  className="text-6xl font-black text-white mb-8 opacity-0 translate-y-[-50px]"
                  data-section1-anim="title"
                >
                  Uzman Danışmanlık
                </h3>
                <p 
                  className="text-2xl text-gray-200 opacity-0 translate-y-[-50px]"
                  data-section1-anim="description"
                >
                  Kendi tasarımınızı buraya yazın...
                </p>
              </div>
            </div>
          </div>

          {/* Section 2 - Kendi tasarımınızı buraya yazın */}
          <div className="flex-shrink-0 relative min-h-screen flex items-center" style={{ width: '100vw' }}>
            {/* Section 2 Background */}
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800"></div>
              <div className="absolute inset-0 bg-black/20"></div>
            </div>

            {/* Section 2 Content - Buraya istediğiniz tasarımı yazın */}
            <div className="relative z-10 w-full px-8 md:px-16 lg:px-24">
              {/* Buraya Section 2 için özel kodunuzu yazın */}
              <div className="text-center">
                <h3 className="text-6xl font-black text-white mb-8">Güvenilir Platform</h3>
                <p className="text-2xl text-gray-200">Kendi tasarımınızı buraya yazın...</p>
              </div>
            </div>
          </div>

          {/* Section 3 - Kendi tasarımınızı buraya yazın */}
          <div className="flex-shrink-0 relative min-h-screen flex items-center" style={{ width: '100vw' }}>
            {/* Section 3 Background */}
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-600 via-red-700 to-pink-800"></div>
              <div className="absolute inset-0 bg-black/20"></div>
            </div>

            {/* Section 3 Content - Buraya istediğiniz tasarımı yazın */}
            <div className="relative z-10 w-full px-8 md:px-16 lg:px-24">
              {/* Buraya Section 3 için özel kodunuzu yazın */}
              <div className="text-center">
                <h3 className="text-6xl font-black text-white mb-8">Düşük Komisyon</h3>
                <p className="text-2xl text-gray-200">Kendi tasarımınızı buraya yazın...</p>
              </div>
            </div>
          </div>

          {/* Section 4 - Kendi tasarımınızı buraya yazın */}
          <div className="flex-shrink-0 relative min-h-screen flex items-center" style={{ width: '100vw' }}>
            {/* Section 4 Background */}
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-700 to-indigo-800"></div>
              <div className="absolute inset-0 bg-black/20"></div>
            </div>

            {/* Section 4 Content - Buraya istediğiniz tasarımı yazın */}
            <div className="relative z-10 w-full px-8 md:px-16 lg:px-24">
              {/* Buraya Section 4 için özel kodunuzu yazın */}
              <div className="text-center">
                <h3 className="text-6xl font-black text-white mb-8">Gelişmiş Teknoloji</h3>
                <p className="text-2xl text-gray-200">Kendi tasarımınızı buraya yazın...</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HorizontalScroll; 