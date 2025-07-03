'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import AuthButtons from "../components/auth/AuthButtons";
import InvestmentSlider from "../components/slider/InvestmentSlider";
import HorizontalScroll from "../components/scroll/HorizontalScroll";
import ChatBot from "../components/chatbot/ChatBot";
import SignUpModal from "../components/modals/SignUpModal";
import LoginModal from "../components/modals/LoginModal";

export default function Home() {
  const [activeTab, setActiveTab] = useState("invest");
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { user, loading } = useAuth();

  const navItems = [
    { id: "invest", label: "Invest", href: "#invest" },
    { id: "currency", label: "Exchange Rates", href: "/currency" },
    { id: "learn", label: "Learn", href: "#learn" },
    { id: "community", label: "Community", href: "#community" },
    { id: "support", label: "Support", href: "#support" }
  ];

  const toggleModals = () => {
    setIsSignUpOpen(!isSignUpOpen);
    setIsLoginOpen(!isLoginOpen);
  };

  const handleGetStarted = () => {
    if (user) {
      // If user is logged in, redirect to portfolio
      window.location.href = '/portfolio';
    } else {
      // If user is not logged in, open signup modal
      setIsSignUpOpen(true);
    }
  };

  return (
    <main className="min-h-screen bg-main">
      {/* Hero Section */}
      <header className="bg-card shadow-modern">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-heading">InvestWise</h1>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            {/* Tab Select Navigation */}
            <div className="flex items-center space-x-1 bg-main rounded-lg p-1">
              {navItems.map((item) => (
                <div key={item.id} className="relative">
                  {activeTab === item.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-card rounded-md shadow-modern"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30
                      }}
                    />
                  )}
                  <button
                    onClick={() => {
                      setActiveTab(item.id);
                      if (item.href.startsWith('#')) {
                        document.querySelector(item.href)?.scrollIntoView({ 
                          behavior: 'smooth' 
                        });
                      } else {
                        window.location.href = item.href;
                      }
                    }}
                    className={`relative z-10 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                      activeTab === item.id
                        ? "text-heading"
                        : "text-main hover:text-heading"
                    }`}
                  >
                    {item.label}
                  </button>
                </div>
              ))}
            </div>
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
            <motion.h2 
              className="text-5xl font-bold mb-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.8, 
                ease: [0.6, -0.05, 0.01, 0.99] 
              }}
            >
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                Invest in your 
              </motion.span>
              <motion.span
                className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  delay: 0.6, 
                  duration: 0.6,
                  type: "spring",
                  stiffness: 200
                }}
              >
                future
              </motion.span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0, duration: 0.8 }}
              >
                {" "}with InvestWise
              </motion.span>
            </motion.h2>

            <motion.p 
              className="text-xl mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: 1.2, 
                duration: 0.8,
                ease: "easeOut"
              }}
            >
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4, duration: 0.6 }}
              >
                Start building your wealth today with our 
              </motion.span>
              <motion.span
                className="text-yellow-300 font-semibold"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  delay: 1.8, 
                  duration: 0.5,
                  type: "spring",
                  stiffness: 300
                }}
              >
                easy-to-use platform
              </motion.span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.2, duration: 0.6 }}
              >
                . Invest confidently in stocks, ETFs, and more.
              </motion.span>
            </motion.p>
            
            {/* Ticker Scroll */}
            <div className="mb-8 overflow-hidden">
              <motion.div
                className="flex space-x-8 whitespace-nowrap"
                animate={{
                  x: [0, -1000]
                }}
                transition={{
                  x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 20,
                    ease: "linear"
                  }
                }}
              >
                {[
                  { text: "📈 AAPL +2.5%", color: "text-blue-200" },
                  { text: "💰 BTC $45,320", color: "text-green-300" },
                  { text: "🏦 USD/TRY 30.15", color: "text-yellow-300" },
                  { text: "📊 S&P 500 +1.2%", color: "text-purple-300" },
                  { text: "💎 Gold $2,045", color: "text-pink-300" },
                  { text: "🚀 TSLA +3.8%", color: "text-indigo-300" },
                  { text: "📱 GOOGL +1.7%", color: "text-orange-300" },
                  { text: "⚡ EUR/USD 1.0845", color: "text-teal-300" }
                ].concat([
                  { text: "📈 AAPL +2.5%", color: "text-blue-200" },
                  { text: "💰 BTC $45,320", color: "text-green-300" },
                  { text: "🏦 USD/TRY 30.15", color: "text-yellow-300" },
                  { text: "📊 S&P 500 +1.2%", color: "text-purple-300" },
                  { text: "💎 Gold $2,045", color: "text-pink-300" },
                  { text: "🚀 TSLA +3.8%", color: "text-indigo-300" },
                  { text: "📱 GOOGL +1.7%", color: "text-orange-300" },
                  { text: "⚡ EUR/USD 1.0845", color: "text-teal-300" }
                ]).map((item, index) => (
                  <span 
                    key={`ticker-${index}`}
                    className={`text-lg font-medium ${item.color}`}
                  >
                    {item.text}
                  </span>
                ))}
              </motion.div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                delay: 2.6, 
                duration: 0.6,
                type: "spring",
                stiffness: 200
              }}
            >
              <motion.div
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)"
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                                 <button 
                   onClick={handleGetStarted}
                   className="bg-accent text-light px-8 py-4 rounded-xl text-lg font-semibold hover:bg-accent/90 inline-flex items-center space-x-2 shadow-modern-lg transition-all duration-200"
                 >
                   <span>{user ? 'Go to Portfolio' : 'Get Started'}</span>
                   <motion.span
                     animate={{ x: [0, 5, 0] }}
                     transition={{ 
                       repeat: Infinity, 
                       duration: 1.5,
                       ease: "easeInOut"
                     }}
                   >
                     →
                   </motion.span>
                 </button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Investment Products Slider with Currency Rates */}
      <InvestmentSlider />

      {/* Horizontal Scroll Section */}
      <HorizontalScroll />

      {/* Features Section */}
      <section className="py-16 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center text-heading">Why InvestWise?</h2>
          <p className="text-center text-muted mb-12">We provide the tools and resources you need to succeed in the market.</p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-lg border border-muted/20 bg-main shadow-modern">
              <div className="mb-4">
                <Image src="/performance.svg" alt="Performance" width={40} height={40} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-heading">Performance Tracking</h3>
              <p className="text-main">Track your portfolio's performance in real-time with detailed analytics and insights.</p>
            </div>

            <div className="p-6 rounded-lg border border-muted/20 bg-main shadow-modern">
              <div className="mb-4">
                <Image src="/security.svg" alt="Security" width={40} height={40} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-heading">Secure Investments</h3>
              <p className="text-main">Your investments are protected with top-tier security measures for your peace of mind.</p>
            </div>

            <div className="p-6 rounded-lg border border-muted/20 bg-main shadow-modern">
              <div className="mb-4">
                <Image src="/community.svg" alt="Community" width={40} height={40} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-heading">Community Support</h3>
              <p className="text-main">Join our vibrant investor community to share ideas, learn from experts, and stay informed.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Investment Section */}
      <section id="invest" className="py-16 bg-main">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-heading">Investment Opportunities</h2>
          <p className="text-center text-muted mb-12 max-w-3xl mx-auto">
            Explore our wide range of portfolio options across various risk levels and sectors. 
            Achieve your financial goals with investment instruments analyzed by our expert team.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card rounded-lg overflow-hidden shadow-modern">
              <div className="relative h-48">
                <Image src="/real-estate.jpg" alt="Real Estate" fill className="object-cover" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-heading">Real Estate Fund</h3>
                <p className="text-main">Invest in high-yield real estate portfolio.</p>
              </div>
            </div>

            <div className="bg-card rounded-lg overflow-hidden shadow-modern">
              <div className="relative h-48">
                <Image src="/tech.jpg" alt="Technology" fill className="object-cover" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-heading">Technology Growth Portfolio</h3>
                <p className="text-main">Benefit from the growth of leading technology companies with our carefully curated portfolio.</p>
              </div>
            </div>

            <div className="bg-card rounded-lg overflow-hidden shadow-modern">
              <div className="relative h-48">
                <Image src="/sustainable.jpg" alt="Sustainable Living" fill className="object-cover" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-heading">Sustainable Living Investments</h3>
                <p className="text-main">Sustainable investment option supporting environmentally friendly ventures and companies.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Learn Section */}
      <section id="learn" className="py-16 bg-card">
                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <h2 className="text-3xl font-bold mb-12 text-center text-heading">Learn</h2>
           <p className="text-center text-muted mb-12 max-w-3xl mx-auto">
             Acquire the knowledge and skills necessary to succeed in the investment world. Develop yourself 
             with comprehensive educational materials prepared by our expert instructors.
           </p>
          
          <div className="grid md:grid-cols-3 gap-8">
                         <div className="bg-main p-6 rounded-lg shadow-modern">
               <h3 className="text-xl font-semibold mb-4 text-heading">Basic Investment Education</h3>
               <p className="text-main mb-4">Take your first step into the investment world. Learn basic concepts, risk management, and portfolio creation.</p>
               <ul className="text-sm text-main space-y-2">
                 <li>• Investment instruments introduction</li>
                 <li>• Risk assessment</li>
                 <li>• Portfolio diversification</li>
                 <li>• Market analysis fundamentals</li>
               </ul>
             </div>

             <div className="bg-main p-6 rounded-lg shadow-modern">
               <h3 className="text-xl font-semibold mb-4 text-heading">Advanced Strategies</h3>
               <p className="text-main mb-4">Advanced analysis techniques and strategy development for experienced investors.</p>
               <ul className="text-sm text-main space-y-2">
                 <li>• Technical analysis</li>
                 <li>• Fundamental analysis</li>
                 <li>• Derivative instruments</li>
                 <li>• Algorithmic investing</li>
               </ul>
             </div>

             <div className="bg-main p-6 rounded-lg shadow-modern">
               <h3 className="text-xl font-semibold mb-4 text-heading">Market Updates</h3>
               <p className="text-main mb-4">Current market analysis, economic indicators, and expert opinions.</p>
               <ul className="text-sm text-main space-y-2">
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

      {/* ChatBot */}
      <ChatBot />

      {/* Auth Modals */}
      {isSignUpOpen && (
        <SignUpModal 
          isOpen={isSignUpOpen} 
          onClose={() => setIsSignUpOpen(false)}
          onToggleModal={toggleModals}
        />
      )}
      {isLoginOpen && (
        <LoginModal 
          isOpen={isLoginOpen} 
          onClose={() => setIsLoginOpen(false)}
          onToggleModal={toggleModals}
        />
      )}
    </main>
  );
}
