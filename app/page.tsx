'use client';

import Image from "next/image";
import Link from "next/link";
import AuthButtons from "./components/auth/AuthButtons";
import InvestmentSlider from "./components/slider/InvestmentSlider";

export default function Home() {

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <header className="bg-white">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">InvestWise</h1>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/invest" className="text-gray-600 hover:text-gray-900">Yatırım</Link>
            <Link href="/learn" className="text-gray-600 hover:text-gray-900">Öğren</Link>
            <Link href="/community" className="text-gray-600 hover:text-gray-900">Topluluk</Link>
            <Link href="/support" className="text-gray-600 hover:text-gray-900">Destek</Link>
            <AuthButtons />
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative h-[500px]">
        <div className="absolute inset-0">
          <Image
            src="/building-hero.jpg"
            alt="Modern building"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white max-w-2xl">
            <h2 className="text-5xl font-bold mb-4">InvestWise ile geleceğinize yatırım yapın</h2>
            <p className="text-xl mb-8">Kullanımı kolay platformumuzla bugün servetinizi oluşturmaya başlayın. Hisse senetleri, ETF'ler ve daha fazlasına güvenle yatırım yapın.</p>
            <Link href="/get-started" className="bg-blue-500 text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-blue-600 inline-block">
              Hemen Başla
            </Link>
          </div>
        </div>
      </section>

      {/* Investment Products Slider */}
      <InvestmentSlider />

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center">Neden InvestWise?</h2>
          <p className="text-center text-gray-600 mb-12">Piyasada başarılı olmanız için ihtiyacınız olan araçları ve kaynakları sağlıyoruz.</p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-lg border border-gray-200">
              <div className="mb-4">
                <Image src="/performance.svg" alt="Performance" width={40} height={40} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Performans Takibi</h3>
              <p className="text-gray-600">Portföyünüzün performansını detaylı analiz ve içgörülerle gerçek zamanlı olarak izleyin.</p>
            </div>

            <div className="p-6 rounded-lg border border-gray-200">
              <div className="mb-4">
                <Image src="/security.svg" alt="Security" width={40} height={40} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Güvenli Yatırımlar</h3>
              <p className="text-gray-600">Yatırımlarınız en üst düzey güvenlik önlemleriyle korunur, içiniz rahat olsun.</p>
            </div>

            <div className="p-6 rounded-lg border border-gray-200">
              <div className="mb-4">
                <Image src="/community.svg" alt="Community" width={40} height={40} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Topluluk Desteği</h3>
              <p className="text-gray-600">Fikirleri paylaşmak, uzmanlardan öğrenmek ve bilgi sahibi olmak için canlı yatırımcı topluluğumuza katılın.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Investments */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12">Öne Çıkan Yatırımlar</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg overflow-hidden shadow">
              <div className="relative h-48">
                <Image src="/real-estate.jpg" alt="Real Estate" fill className="object-cover" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Gayrimenkul Fonu</h3>
                <p className="text-gray-600">Yüksek getirili gayrimenkul portföyüne yatırım yapın.</p>
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow">
              <div className="relative h-48">
                <Image src="/tech.jpg" alt="Technology" fill className="object-cover" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Teknoloji Büyüme Portföyü</h3>
                <p className="text-gray-600">Özenle seçilmiş portföyle lider teknoloji şirketlerinin büyümesinden faydalanın.</p>
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow">
              <div className="relative h-48">
                <Image src="/sustainable.jpg" alt="Sustainable Living" fill className="object-cover" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Sürdürülebilir Yaşam Yatırımları</h3>
                <p className="text-gray-600">Çevre dostu girişimleri ve şirketleri destekleyen sürdürülebilir yatırım seçeneği.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Performance Metrics */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12">Performans Metrikleri</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg text-gray-600 mb-2">Ortalama Getiri</h3>
              <p className="text-4xl font-bold">12.5%</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg text-gray-600 mb-2">Müşteri Memnuniyeti</h3>
              <p className="text-4xl font-bold">95%</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg text-gray-600 mb-2">Yönetilen Varlık</h3>
              <p className="text-4xl font-bold">500M₺+</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <Link href="/about" className="text-gray-600 hover:text-gray-900">Hakkımızda</Link>
            <Link href="/contact" className="text-gray-600 hover:text-gray-900">İletişim</Link>
            <Link href="/privacy" className="text-gray-600 hover:text-gray-900">Gizlilik Politikası</Link>
            <Link href="/terms" className="text-gray-600 hover:text-gray-900">Kullanım Koşulları</Link>
          </div>
          <div className="flex justify-center space-x-6">
            <Link href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Twitter</span>
              <Image src="/twitter.svg" alt="Twitter" width={24} height={24} />
            </Link>
            <Link href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Facebook</span>
              <Image src="/facebook.svg" alt="Facebook" width={24} height={24} />
            </Link>
            <Link href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Instagram</span>
              <Image src="/instagram.svg" alt="Instagram" width={24} height={24} />
            </Link>
          </div>
          <p className="text-center text-gray-500 mt-8">©2024 InvestWise. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </main>
  );
}
