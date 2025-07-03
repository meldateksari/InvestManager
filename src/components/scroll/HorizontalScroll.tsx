'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const HorizontalScroll = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<HTMLDivElement>(null);

  const reasons = [
    {
      title: "Uzman Danışmanlık",
      description: "10+ yıl deneyimli uzman ekibimiz sizin için en uygun yatırım stratejilerini geliştirir.",
      icon: "🎯",
      features: [
        "Kişiselleştirilmiş portföy önerileri",
        "Risk analizi ve yönetimi", 
        "7/24 uzman desteği",
        "Piyasa analiz raporları"
      ]
    },
    {
      title: "Güvenilir Platform",
      description: "Bankacılık düzeyinde güvenlik önlemleri ile varlıklarınızı koruyoruz.",
      icon: "🔒",
      features: [
        "SSL şifreleme teknolojisi",
        "İki faktörlü kimlik doğrulama",
        "Düzenli güvenlik denetimleri",
        "Sigortalı hesap koruması"
      ]
    },
    {
      title: "Düşük Komisyon",
      description: "Sektörün en düşük komisyon oranları ile daha fazla kazanç elde edin.",
      icon: "💰",
      features: [
        "%0.1 işlem komisyonu",
        "Saklama ücreti yok",
        "Giriş-çıkış ücreti yok",
        "Şeffaf fiyatlandırma"
      ]
    },
    {
      title: "Gelişmiş Teknoloji",
      description: "En son teknoloji ile hızlı ve güvenilir işlem deneyimi yaşayın.",
      icon: "🚀",
      features: [
        "Gerçek zamanlı piyasa verileri",
        "Mobil ve web uygulama",
        "Otomatik yatırım seçenekleri",
        "Gelişmiş analiz araçları"
      ]
    }
  ];

  useEffect(() => {
    let ctx = gsap.context(() => {
      const container = containerRef.current;
      const slides = slidesRef.current;
      
      if (!container || !slides) return;

      // Her slide'ın genişliği
      const slideWidth = window.innerWidth;
      // Toplam kaydırma mesafesi (son slide hariç)
      const totalScrollDistance = slideWidth * (reasons.length - 1);

      // Horizontal scroll animasyonu
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

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative overflow-hidden min-h-screen">
      {/* Modern gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10"></div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-radial from-blue-500/20 via-transparent to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-radial from-indigo-500/20 via-transparent to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>



      {/* Full-width cards container */}
      <div className="relative overflow-hidden">
        <div 
          ref={slidesRef} 
          className="flex will-change-transform"
          style={{ width: `${reasons.length * 100}vw` }}
        >
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="flex-shrink-0 relative min-h-screen flex items-center"
              style={{ width: '100vw' }}
            >
              {/* Full-width card background */}
              <div className="absolute inset-0">
                <div className={`absolute inset-0 ${
                  index === 0 ? 'bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-800' :
                  index === 1 ? 'bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800' :
                  index === 2 ? 'bg-gradient-to-br from-orange-600 via-red-700 to-pink-800' :
                  'bg-gradient-to-br from-violet-600 via-purple-700 to-indigo-800'
                }`}></div>
                <div className="absolute inset-0 bg-black/20"></div>
                
                {/* Pattern overlay */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.2) 2px, transparent 2px),
                                     radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                    backgroundSize: '60px 60px, 40px 40px'
                  }}></div>
                </div>
              </div>

              {/* Content */}
              <div className="relative z-10 w-full px-8 md:px-16 lg:px-24">
                <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                  
                  {/* Left side - Icon & Title */}
                  <div className="text-center lg:text-left">
                    <div className="inline-block p-6 bg-white/10 backdrop-blur-sm rounded-3xl mb-8 hover:scale-110 transition-transform duration-500">
                      <div className="text-6xl md:text-8xl">{reason.icon}</div>
                    </div>
                    <h3 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
                      {reason.title}
                    </h3>
                    <p className="text-xl md:text-2xl text-gray-200 font-light leading-relaxed max-w-2xl lg:max-w-none">
                      {reason.description}
                    </p>
                  </div>

                  {/* Right side - Features */}
                  <div className="space-y-6">
                    {reason.features.map((feature, featureIndex) => (
                      <div 
                        key={featureIndex}
                        className="group flex items-center space-x-6 p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300 cursor-pointer"
                      >
                        <div className="w-4 h-4 bg-white rounded-full flex-shrink-0 group-hover:scale-125 transition-transform duration-300"></div>
                        <span className="text-white font-semibold text-lg md:text-xl group-hover:text-cyan-200 transition-colors duration-300">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HorizontalScroll; 