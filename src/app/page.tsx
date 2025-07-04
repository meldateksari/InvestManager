'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import AuthButtons from "../components/auth/AuthButtons";
import InvestmentSlider from "../components/slider/InvestmentSlider";
import LanguageSwitch from "../components/navbar/LanguageSwitch";
import ChatBot from "../components/chatbot/ChatBot";
import SignUpModal from "../components/modals/SignUpModal";
import LoginModal from "../components/modals/LoginModal";

export default function Home() {
  const [activeTab, setActiveTab] = useState("invest");
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { user } = useAuth();
  const { translations } = useLanguage();

  const navItems = [
    { id: "invest", label: translations.navigation.invest, href: "#invest" },
    { id: "currency", label: translations.navigation.exchange_rates, href: "/currency" },
    { id: "learn", label: translations.navigation.learn, href: "#learn" },
    { id: "community", label: translations.navigation.community, href: "#community" },
    { id: "support", label: translations.navigation.support, href: "#support" }
  ];

  const toggleModals = () => {
    setIsSignUpOpen(!isSignUpOpen);
    setIsLoginOpen(!isLoginOpen);
  };

  const handleGetStarted = () => {
    if (user) {
      window.location.href = '/portfolio';
    } else {
      setIsSignUpOpen(true);
    }
  };

  return (
    <main className="min-h-screen bg-main">
      {/* Hero Section */}
      <header className="bg-card shadow-modern">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-heading">{translations.common.welcome}</h1>
          </div>
          <div className="hidden md:flex items-center space-x-8">
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
            <div className="flex items-center gap-6">
              <AuthButtons />
              <div className="w-px h-6 bg-gray-200/20" />
              <LanguageSwitch />
            </div>
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
                {translations.home.hero.title_part1}{" "}
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
                {translations.home.hero.title_part2}
              </motion.span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0, duration: 0.8 }}
              >
                {" "}{translations.home.hero.title_part3}
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
                {translations.home.hero.subtitle_part1}{" "}
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
                {translations.home.hero.subtitle_part2}
              </motion.span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.2, duration: 0.6 }}
              >
                {translations.home.hero.subtitle_part3}
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
                  { text: translations.home.ticker.stocks, color: "text-blue-200" },
                  { text: translations.home.ticker.crypto, color: "text-green-300" },
                  { text: translations.home.ticker.forex, color: "text-yellow-300" },
                  { text: translations.home.ticker.index, color: "text-purple-300" },
                  { text: translations.home.ticker.commodities, color: "text-pink-300" }
                ].concat([
                  { text: translations.home.ticker.stocks, color: "text-blue-200" },
                  { text: translations.home.ticker.crypto, color: "text-green-300" },
                  { text: translations.home.ticker.forex, color: "text-yellow-300" },
                  { text: translations.home.ticker.index, color: "text-purple-300" },
                  { text: translations.home.ticker.commodities, color: "text-pink-300" }
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
                  <span>{user ? translations.navigation.my_portfolio : translations.home.get_started}</span>
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

      {/* Features Section */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-900">{translations.home.features.title}</h2>
          <p className="text-center text-gray-600 mb-12">{translations.home.features.subtitle}</p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-lg border border-gray-200 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="mb-4">
                <Image src="/performance.svg" alt="Performance" width={40} height={40} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">{translations.home.features.performance.title}</h3>
              <p className="text-gray-600">{translations.home.features.performance.description}</p>
            </div>

            <div className="p-6 rounded-lg border border-gray-200 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="mb-4">
                <Image src="/security.svg" alt="Security" width={40} height={40} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">{translations.home.features.security.title}</h3>
              <p className="text-gray-600">{translations.home.features.security.description}</p>
            </div>

            <div className="p-6 rounded-lg border border-gray-200 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="mb-4">
                <Image src="/community.svg" alt="Community" width={40} height={40} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">{translations.home.features.community.title}</h3>
              <p className="text-gray-600">{translations.home.features.community.description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Investment Section */}
      <section id="invest" className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-white">{translations.home.investment.title}</h2>
          <p className="text-center text-gray-300 mb-12 max-w-3xl mx-auto">
            {translations.home.investment.subtitle}
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-900 rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-gray-800">
              <div className="relative h-48">
                <Image src="/images/real_estate_fund.jpg" alt="Real Estate" fill className="object-cover" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-white">{translations.home.investment.real_estate.title}</h3>
                <p className="text-gray-300">{translations.home.investment.real_estate.description}</p>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-gray-800">
              <div className="relative h-48">
                <Image src="/images/technology_growth_portfolio.jpg" alt="Technology" fill className="object-cover" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-white">{translations.home.investment.tech.title}</h3>
                <p className="text-gray-300">{translations.home.investment.tech.description}</p>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-gray-800">
              <div className="relative h-48">
                <Image src="/images/sustainable_living_investments.jpg" alt="Sustainable Living" fill className="object-cover" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-white">{translations.home.investment.sustainable.title}</h3>
                <p className="text-gray-300">{translations.home.investment.sustainable.description}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Learn Section */}
      <section id="learn" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-900">{translations.home.learn.title}</h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            {translations.home.learn.subtitle}
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">{translations.home.learn.basic.title}</h3>
              <p className="text-gray-600 mb-4">{translations.home.learn.basic.description}</p>
              <ul className="text-sm text-gray-600 space-y-2">
                {translations.home.learn.basic.topics.map((topic, index) => (
                  <li key={`basic-topic-${index}`}>• {topic}</li>
                ))}
              </ul>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">{translations.home.learn.advanced.title}</h3>
              <p className="text-gray-600 mb-4">{translations.home.learn.advanced.description}</p>
              <ul className="text-sm text-gray-600 space-y-2">
                {translations.home.learn.advanced.topics.map((topic, index) => (
                  <li key={`advanced-topic-${index}`}>• {topic}</li>
                ))}
              </ul>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">{translations.home.learn.market.title}</h3>
              <p className="text-gray-600 mb-4">{translations.home.learn.market.description}</p>
              <ul className="text-sm text-gray-600 space-y-2">
                {translations.home.learn.market.topics.map((topic, index) => (
                  <li key={`market-topic-${index}`}>• {topic}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section id="community" className="py-16 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center text-white">{translations.home.community.title}</h2>
          <p className="text-center text-gray-300 mb-12 max-w-3xl mx-auto">
            {translations.home.community.subtitle}
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-700 p-8 rounded-lg shadow-xl border border-gray-600">
              <h3 className="text-xl font-semibold mb-4 text-white">{translations.home.community.forums.title}</h3>
              <p className="text-gray-300 mb-6">
                {translations.home.community.forums.description}
              </p>
              <div className="space-y-3">
                {Object.entries(translations.home.community.forums.categories).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between bg-gray-600 p-3 rounded">
                    <span className="text-sm font-medium text-white">{value}</span>
                    <span className="text-xs text-gray-300">
                      {key === 'stocks' ? '2.3k' : key === 'crypto' ? '1.8k' : '1.2k'} members
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-700 p-8 rounded-lg shadow-xl border border-gray-600">
              <h3 className="text-xl font-semibold mb-4 text-white">{translations.home.community.events.title}</h3>
              <p className="text-gray-300 mb-6">
                {translations.home.community.events.description}
              </p>
              <div className="space-y-3">
                {Object.entries(translations.home.community.events.types).map(([key, value], index) => (
                  <div key={key} className={`border-l-4 pl-4 ${
                    index === 0 ? 'border-blue-400' : 
                    index === 1 ? 'border-green-400' : 
                    'border-purple-400'
                  }`}>
                    <h4 className="font-medium text-white">{value}</h4>
                    <p className="text-sm text-gray-300">
                      {index === 0 ? 'Every Thursday 7:00 PM' : 
                       index === 1 ? 'Monthly organized' : 
                       'Every Saturday 2:00 PM'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section id="support" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-900">{translations.home.support.title}</h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            {translations.home.support.subtitle}
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📞</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">{translations.home.support.phone.title}</h3>
              <p className="text-gray-600 mb-4">{translations.home.support.phone.description}</p>
              <p className="font-semibold text-blue-600">0850 123 45 67</p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">{translations.home.support.live_chat.title}</h3>
              <p className="text-gray-600 mb-4">{translations.home.support.live_chat.description}</p>
              <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors duration-200">
                {translations.home.support.live_chat.title}
              </button>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📧</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">{translations.home.support.email.title}</h3>
              <p className="text-gray-600 mb-4">{translations.home.support.email.description}</p>
              <p className="font-semibold text-purple-600">support@investwise.com</p>
            </div>
          </div>

          <div className="mt-12 bg-white p-8 rounded-lg shadow-lg border border-gray-200">
            <h3 className="text-2xl font-semibold mb-6 text-center text-gray-900">{translations.home.faq.title}</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(translations.home.faq.questions).map(([key, value]) => (
                <div key={key}>
                  <h4 className="font-semibold mb-2 text-gray-900">{value.question}</h4>
                  <p className="text-gray-600 text-sm">{value.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Performance Metrics */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-white">Performance Metrics</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
              <h3 className="text-lg text-gray-300 mb-2">{translations.home.metrics.average_return.title}</h3>
              <p className="text-4xl font-bold text-white">{translations.home.metrics.average_return.value}</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
              <h3 className="text-lg text-gray-300 mb-2">{translations.home.metrics.customer_satisfaction.title}</h3>
              <p className="text-4xl font-bold text-white">{translations.home.metrics.customer_satisfaction.value}</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
              <h3 className="text-lg text-gray-300 mb-2">{translations.home.metrics.assets.title}</h3>
              <p className="text-4xl font-bold text-white">{translations.home.metrics.assets.value}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <Link href="/about" className="text-gray-300 hover:text-white transition-colors duration-200">About</Link>
            <Link href="/contact" className="text-gray-300 hover:text-white transition-colors duration-200">Contact</Link>
            <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors duration-200">Privacy Policy</Link>
            <Link href="/terms" className="text-gray-300 hover:text-white transition-colors duration-200">Terms of Service</Link>
          </div>
          <div className="flex justify-center space-x-6">
            <Link href="#" className="text-gray-400 hover:text-gray-200 transition-colors duration-200">
              <span className="sr-only">Twitter</span>
              <Image src="/twitter.svg" alt="Twitter" width={24} height={24} />
            </Link>
            <Link href="#" className="text-gray-400 hover:text-gray-200 transition-colors duration-200">
              <span className="sr-only">Facebook</span>
              <Image src="/facebook.svg" alt="Facebook" width={24} height={24} />
            </Link>
            <Link href="#" className="text-gray-400 hover:text-gray-200 transition-colors duration-200">
              <span className="sr-only">Instagram</span>
              <Image src="/instagram.svg" alt="Instagram" width={24} height={24} />
            </Link>
          </div>
          <p className="text-center text-gray-400 mt-8">©2025 InvestWise. All rights reserved.</p>
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
