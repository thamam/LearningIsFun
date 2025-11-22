'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage, t } = useTranslation();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'he' : 'en');
  };

  return (
    <nav className="bg-white/90 backdrop-blur-sm shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">🎓</span>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              LearningIsFun
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-gray-600 hover:text-purple-600 font-medium transition-colors"
            >
              {t('nav.home')}
            </Link>
            <Link
              href="/pricing"
              className="text-gray-600 hover:text-purple-600 font-medium transition-colors"
            >
              {t('nav.pricing')}
            </Link>
            <Link
              href="/dashboard"
              className="text-gray-600 hover:text-purple-600 font-medium transition-colors"
            >
              {t('nav.dashboard')}
            </Link>
            <Link
              href="/parent-portal"
              className="text-gray-600 hover:text-purple-600 font-medium transition-colors"
            >
              {t('nav.parentPortal')}
            </Link>
          </div>

          {/* CTA Buttons + Language Toggle */}
          <div className="flex items-center space-x-3">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="text-2xl hover:scale-110 transition-transform"
              aria-label={t('nav.toggleLanguage')}
              title={language === 'en' ? t('nav.switchToHebrew') : t('nav.switchToEnglish')}
            >
              {language === 'en' ? '🇮🇱' : '🇺🇸'}
            </button>

            <Link
              href="/dashboard"
              className="hidden sm:inline-block bg-purple-100 text-purple-600 px-4 py-2 rounded-full font-medium hover:bg-purple-200 transition-colors"
            >
              {t('nav.logIn')}
            </Link>
            <Link
              href="/pricing"
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full font-medium hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              {t('nav.signUp')}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-600 hover:text-purple-600"
            aria-label={t('nav.toggleMenu')}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <title>{t('nav.openMenu')}</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4">
            <div className="flex flex-col space-y-3">
              <Link
                href="/"
                className="text-gray-600 hover:text-purple-600 font-medium transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {t('nav.home')}
              </Link>
              <Link
                href="/pricing"
                className="text-gray-600 hover:text-purple-600 font-medium transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {t('nav.pricing')}
              </Link>
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-purple-600 font-medium transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {t('nav.dashboard')}
              </Link>
              <Link
                href="/parent-portal"
                className="text-gray-600 hover:text-purple-600 font-medium transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {t('nav.parentPortal')}
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
