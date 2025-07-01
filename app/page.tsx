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
            <Link href="#invest" className="text-gray-600 hover:text-gray-900">Invest</Link>
            <Link href="#learn" className="text-gray-600 hover:text-gray-900">Learn</Link>
            <Link href="#community" className="text-gray-600 hover:text-gray-900">Community</Link>
            <Link href="#support" className="text-gray-600 hover:text-gray-900">Support</Link>
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
            <h2 className="text-5xl font-bold mb-4">Invest in your future with InvestWise</h2>
            <p className="text-xl mb-8">Start building your wealth today with our easy-to-use platform. Invest confidently in stocks, ETFs, and more.</p>
            <Link href="/get-started" className="bg-blue-500 text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-blue-600 inline-block">
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Investment Products Slider */}
      <InvestmentSlider />

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center">Why InvestWise?</h2>
          <p className="text-center text-gray-600 mb-12">We provide the tools and resources you need to succeed in the market.</p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-lg border border-gray-200">
              <div className="mb-4">
                <Image src="/performance.svg" alt="Performance" width={40} height={40} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Performance Tracking</h3>
              <p className="text-gray-600">Track your portfolio's performance in real-time with detailed analytics and insights.</p>
            </div>

            <div className="p-6 rounded-lg border border-gray-200">
              <div className="mb-4">
                <Image src="/security.svg" alt="Security" width={40} height={40} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Investments</h3>
              <p className="text-gray-600">Your investments are protected with top-tier security measures for your peace of mind.</p>
            </div>

            <div className="p-6 rounded-lg border border-gray-200">
              <div className="mb-4">
                <Image src="/community.svg" alt="Community" width={40} height={40} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Community Support</h3>
              <p className="text-gray-600">Join our vibrant investor community to share ideas, learn from experts, and stay informed.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Investment Section */}
      <section id="invest" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12">Investment Opportunities</h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            Explore our wide range of portfolio options across various risk levels and sectors. 
            Achieve your financial goals with investment instruments analyzed by our expert team.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg overflow-hidden shadow">
              <div className="relative h-48">
                <Image src="/real-estate.jpg" alt="Real Estate" fill className="object-cover" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Real Estate Fund</h3>
                <p className="text-gray-600">Invest in high-yield real estate portfolio.</p>
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow">
              <div className="relative h-48">
                <Image src="/tech.jpg" alt="Technology" fill className="object-cover" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Technology Growth Portfolio</h3>
                <p className="text-gray-600">Benefit from the growth of leading technology companies with our carefully curated portfolio.</p>
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow">
              <div className="relative h-48">
                <Image src="/sustainable.jpg" alt="Sustainable Living" fill className="object-cover" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Sustainable Living Investments</h3>
                <p className="text-gray-600">Sustainable investment option supporting environmentally friendly ventures and companies.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Learn Section */}
      <section id="learn" className="py-16 bg-white">
                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <h2 className="text-3xl font-bold mb-12 text-center">Learn</h2>
           <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
             Acquire the knowledge and skills necessary to succeed in the investment world. Develop yourself 
             with comprehensive educational materials prepared by our expert instructors.
           </p>
          
          <div className="grid md:grid-cols-3 gap-8">
                         <div className="bg-gray-50 p-6 rounded-lg">
               <h3 className="text-xl font-semibold mb-4">Basic Investment Education</h3>
               <p className="text-gray-600 mb-4">Take your first step into the investment world. Learn basic concepts, risk management, and portfolio creation.</p>
               <ul className="text-sm text-gray-600 space-y-2">
                 <li>• Investment instruments introduction</li>
                 <li>• Risk assessment</li>
                 <li>• Portfolio diversification</li>
                 <li>• Market analysis fundamentals</li>
               </ul>
             </div>

             <div className="bg-gray-50 p-6 rounded-lg">
               <h3 className="text-xl font-semibold mb-4">Advanced Strategies</h3>
               <p className="text-gray-600 mb-4">Advanced analysis techniques and strategy development for experienced investors.</p>
               <ul className="text-sm text-gray-600 space-y-2">
                 <li>• Technical analysis</li>
                 <li>• Fundamental analysis</li>
                 <li>• Derivative instruments</li>
                 <li>• Algorithmic investing</li>
               </ul>
             </div>

             <div className="bg-gray-50 p-6 rounded-lg">
               <h3 className="text-xl font-semibold mb-4">Market Updates</h3>
               <p className="text-gray-600 mb-4">Current market analysis, economic indicators, and expert opinions.</p>
               <ul className="text-sm text-gray-600 space-y-2">
                 <li>• Daily market analysis</li>
                 <li>• Weekly reports</li>
                 <li>• Expert webinars</li>
                 <li>• Sector evaluations</li>
               </ul>
             </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section id="community" className="py-16 bg-gray-50">
                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <h2 className="text-3xl font-bold mb-12 text-center">Community</h2>
           <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
             Join our community of thousands of investors. Share your experiences, 
             learn from experts, and achieve success together.
           </p>
          
          <div className="grid md:grid-cols-2 gap-8">
                         <div className="bg-white p-8 rounded-lg shadow">
               <h3 className="text-xl font-semibold mb-4">Discussion Forums</h3>
               <p className="text-gray-600 mb-6">
                 Active forum areas for investment strategies, market analysis, and experience sharing.
               </p>
               <div className="space-y-3">
                 <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
                   <span className="text-sm font-medium">Stock Commentary</span>
                   <span className="text-xs text-gray-500">2.3k members</span>
                 </div>
                 <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
                   <span className="text-sm font-medium">Cryptocurrency</span>
                   <span className="text-xs text-gray-500">1.8k members</span>
                 </div>
                 <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
                   <span className="text-sm font-medium">Real Estate Investment</span>
                   <span className="text-xs text-gray-500">1.2k members</span>
                 </div>
               </div>
             </div>

             <div className="bg-white p-8 rounded-lg shadow">
               <h3 className="text-xl font-semibold mb-4">Expert Events</h3>
               <p className="text-gray-600 mb-6">
                 Webinar, seminar, and workshop events organized with expert speakers in their fields.
               </p>
               <div className="space-y-3">
                 <div className="border-l-4 border-blue-500 pl-4">
                   <h4 className="font-medium">Weekly Market Analysis</h4>
                   <p className="text-sm text-gray-600">Every Thursday 7:00 PM</p>
                 </div>
                 <div className="border-l-4 border-green-500 pl-4">
                   <h4 className="font-medium">Investment Strategies Seminar</h4>
                   <p className="text-sm text-gray-600">Monthly organized</p>
                 </div>
                 <div className="border-l-4 border-purple-500 pl-4">
                   <h4 className="font-medium">Beginners Workshop</h4>
                   <p className="text-sm text-gray-600">Every Saturday 2:00 PM</p>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section id="support" className="py-16 bg-white">
                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <h2 className="text-3xl font-bold mb-12 text-center">Support</h2>
           <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
             Our 24/7 customer support team is always with you. We answer your questions, 
             help with technical issues, and guide you in your investment decisions.
           </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📞</span>
              </div>
                             <h3 className="text-xl font-semibold mb-2">Phone Support</h3>
               <p className="text-gray-600 mb-4">24/7 phone support line you can reach</p>
               <p className="font-semibold text-blue-600">0850 123 45 67</p>
             </div>

             <div className="text-center p-6">
               <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                 <span className="text-2xl">💬</span>
               </div>
               <h3 className="text-xl font-semibold mb-2">Live Chat</h3>
               <p className="text-gray-600 mb-4">Live chat support where you can get instant responses</p>
               <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                 Start Chat
               </button>
             </div>

             <div className="text-center p-6">
               <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                 <span className="text-2xl">📧</span>
               </div>
               <h3 className="text-xl font-semibold mb-2">Email Support</h3>
               <p className="text-gray-600 mb-4">Email support for your detailed questions</p>
               <p className="font-semibold text-purple-600">support@investwise.com</p>
            </div>
          </div>

                     <div className="mt-12 bg-gray-50 p-8 rounded-lg">
             <h3 className="text-2xl font-semibold mb-6 text-center">Frequently Asked Questions</h3>
             <div className="grid md:grid-cols-2 gap-6">
               <div>
                 <h4 className="font-semibold mb-2">How does the account opening process work?</h4>
                 <p className="text-gray-600 text-sm">Your account becomes active within 24 hours with identity verification.</p>
               </div>
               <div>
                 <h4 className="font-semibold mb-2">What is the minimum investment amount?</h4>
                 <p className="text-gray-600 text-sm">You can start investing with a minimum of $500 for beginners.</p>
               </div>
               <div>
                 <h4 className="font-semibold mb-2">How long does the withdrawal process take?</h4>
                 <p className="text-gray-600 text-sm">Withdrawal requests are transferred to your account within 1-3 business days.</p>
               </div>
               <div>
                 <h4 className="font-semibold mb-2">Is there an investment advisory service?</h4>
                 <p className="text-gray-600 text-sm">Yes, you can request a free consultation from our expert advisors.</p>
               </div>
             </div>
           </div>
        </div>
      </section>

      {/* Performance Metrics */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12">Performance Metrics</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg">
              <h3 className="text-lg text-gray-600 mb-2">Average Return</h3>
              <p className="text-4xl font-bold">12.5%</p>
            </div>
            <div className="bg-white p-6 rounded-lg">
              <h3 className="text-lg text-gray-600 mb-2">Customer Satisfaction</h3>
              <p className="text-4xl font-bold">95%</p>
            </div>
            <div className="bg-white p-6 rounded-lg">
              <h3 className="text-lg text-gray-600 mb-2">Assets Under Management</h3>
              <p className="text-4xl font-bold">$2B+</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <Link href="/about" className="text-gray-600 hover:text-gray-900">About</Link>
            <Link href="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
            <Link href="/privacy" className="text-gray-600 hover:text-gray-900">Privacy Policy</Link>
            <Link href="/terms" className="text-gray-600 hover:text-gray-900">Terms of Service</Link>
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
          <p className="text-center text-gray-500 mt-8">©2024 InvestWise. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
