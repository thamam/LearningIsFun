'use client';

import Link from "next/link";
import { useTranslation } from '@/lib/i18n';

interface PlanFeature {
  text: string;
  included: boolean;
}

interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: PlanFeature[];
  buttonText: string;
  buttonColor: string;
  popular?: boolean;
  emoji: string;
}

export default function PricingPage() {
  const { t } = useTranslation();

  const plans: PricingPlan[] = [
    {
      name: t('pricing.plans.free.name'),
      price: t('pricing.plans.free.price'),
      period: t('pricing.plans.free.period'),
      description: t('pricing.plans.free.description'),
      emoji: "🌟",
      features: [
        { text: t('pricing.plans.free.features.subjects'), included: true },
        { text: t('pricing.plans.free.features.lessons'), included: true },
        { text: t('pricing.plans.free.features.tracking'), included: true },
        { text: t('pricing.plans.free.features.badges'), included: true },
        { text: t('pricing.plans.free.features.unlimited'), included: false },
        { text: t('pricing.plans.free.features.allSubjects'), included: false },
        { text: t('pricing.plans.free.features.parentDashboard'), included: false },
        { text: t('pricing.plans.free.features.worksheets'), included: false },
      ],
      buttonText: t('pricing.plans.free.buttonText'),
      buttonColor: "bg-gray-500 hover:bg-gray-600",
    },
    {
      name: t('pricing.plans.super.name'),
      price: t('pricing.plans.super.price'),
      period: t('pricing.plans.super.period'),
      description: t('pricing.plans.super.description'),
      emoji: "🚀",
      popular: true,
      features: [
        { text: t('pricing.plans.super.features.allSubjects'), included: true },
        { text: t('pricing.plans.super.features.unlimited'), included: true },
        { text: t('pricing.plans.super.features.advancedTracking'), included: true },
        { text: t('pricing.plans.super.features.allBadges'), included: true },
        { text: t('pricing.plans.super.features.parentDashboard'), included: true },
        { text: t('pricing.plans.super.features.worksheets'), included: true },
        { text: t('pricing.plans.super.features.adFree'), included: true },
        { text: t('pricing.plans.super.features.prioritySupport'), included: false },
      ],
      buttonText: t('pricing.plans.super.buttonText'),
      buttonColor: "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600",
    },
    {
      name: t('pricing.plans.family.name'),
      price: t('pricing.plans.family.price'),
      period: t('pricing.plans.family.period'),
      description: t('pricing.plans.family.description'),
      emoji: "👨‍👩‍👧‍👦",
      features: [
        { text: t('pricing.plans.family.features.everything'), included: true },
        { text: t('pricing.plans.family.features.profiles'), included: true },
        { text: t('pricing.plans.family.features.familyReports'), included: true },
        { text: t('pricing.plans.family.features.siblingChallenges'), included: true },
        { text: t('pricing.plans.family.features.customPaths'), included: true },
        { text: t('pricing.plans.family.features.tutorSessions'), included: true },
        { text: t('pricing.plans.family.features.prioritySupport'), included: true },
        { text: t('pricing.plans.family.features.earlyAccess'), included: true },
      ],
      buttonText: t('pricing.plans.family.buttonText'),
      buttonColor: "bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600",
    },
  ];
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 via-purple-100 to-pink-100 py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-purple-600 mb-4">
            {t('pricing.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('pricing.subtitle')}
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-white rounded-3xl p-8 shadow-xl relative ${
                plan.popular ? "ring-4 ring-purple-500 transform md:scale-105" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                    {t('pricing.mostPopular')}
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <div className="text-5xl mb-4">{plan.emoji}</div>
                <h2 className="text-2xl font-bold text-gray-800">{plan.name}</h2>
                <p className="text-gray-500 text-sm">{plan.description}</p>
              </div>

              <div className="text-center mb-6">
                <span className="text-5xl font-bold text-purple-600">{plan.price}</span>
                <span className="text-gray-500 block">{plan.period}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    {feature.included ? (
                      <span className="text-green-500 mr-2">✓</span>
                    ) : (
                      <span className="text-gray-300 mr-2">✗</span>
                    )}
                    <span className={feature.included ? "text-gray-700" : "text-gray-400"}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href="/dashboard"
                className={`block w-full text-center text-white px-6 py-3 rounded-full font-bold transform hover:scale-105 transition-all ${plan.buttonColor}`}
              >
                {plan.buttonText}
              </Link>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-purple-600 mb-8">
            {t('pricing.faq.title')}
          </h2>

          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="font-bold text-lg text-gray-800 mb-2">
                {t('pricing.faq.cancel.question')}
              </h3>
              <p className="text-gray-600">
                {t('pricing.faq.cancel.answer')}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="font-bold text-lg text-gray-800 mb-2">
                {t('pricing.faq.free.question')}
              </h3>
              <p className="text-gray-600">
                {t('pricing.faq.free.answer')}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="font-bold text-lg text-gray-800 mb-2">
                {t('pricing.faq.switch.question')}
              </h3>
              <p className="text-gray-600">
                {t('pricing.faq.switch.answer')}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-600 mb-4">
            {t('pricing.notSure')}
          </p>
          <Link
            href="/"
            className="text-purple-600 font-bold hover:text-purple-700 underline"
          >
            {t('pricing.learnMore')}
          </Link>
        </div>
      </div>
    </div>
  );
}
