import Link from "next/link";

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

const plans: PricingPlan[] = [
  {
    name: "Free Explorer",
    price: "$0",
    period: "forever",
    description: "Perfect for trying things out!",
    emoji: "🌟",
    features: [
      { text: "3 subjects available", included: true },
      { text: "5 lessons per week", included: true },
      { text: "Basic progress tracking", included: true },
      { text: "Earn starter badges", included: true },
      { text: "Unlimited lessons", included: false },
      { text: "All subjects unlocked", included: false },
      { text: "Parent dashboard", included: false },
      { text: "Printable worksheets", included: false },
    ],
    buttonText: "Start Free",
    buttonColor: "bg-gray-500 hover:bg-gray-600",
  },
  {
    name: "Super Learner",
    price: "$9.99",
    period: "per month",
    description: "Our most popular choice!",
    emoji: "🚀",
    popular: true,
    features: [
      { text: "All subjects unlocked", included: true },
      { text: "Unlimited lessons", included: true },
      { text: "Advanced progress tracking", included: true },
      { text: "Earn all badges & trophies", included: true },
      { text: "Parent dashboard", included: true },
      { text: "Printable worksheets", included: true },
      { text: "Ad-free experience", included: true },
      { text: "Priority support", included: false },
    ],
    buttonText: "Choose Super",
    buttonColor: "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600",
  },
  {
    name: "Family Champions",
    price: "$19.99",
    period: "per month",
    description: "Best for families with multiple kids!",
    emoji: "👨‍👩‍👧‍👦",
    features: [
      { text: "Everything in Super Learner", included: true },
      { text: "Up to 4 kid profiles", included: true },
      { text: "Family progress reports", included: true },
      { text: "Sibling challenges", included: true },
      { text: "Custom learning paths", included: true },
      { text: "1-on-1 tutor sessions", included: true },
      { text: "Priority support", included: true },
      { text: "Early access to new content", included: true },
    ],
    buttonText: "Go Family",
    buttonColor: "bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600",
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 via-purple-100 to-pink-100 py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-purple-600 mb-4">
            Pick Your Plan! 🎁
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the perfect plan for your learning adventure.
            Start free and upgrade anytime!
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
                    Most Popular! ⭐
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
            Questions? We Got Answers! 🤔
          </h2>

          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="font-bold text-lg text-gray-800 mb-2">
                Can I cancel anytime?
              </h3>
              <p className="text-gray-600">
                Yes! You can cancel your subscription anytime. No hidden fees or tricks!
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="font-bold text-lg text-gray-800 mb-2">
                Is the free plan really free?
              </h3>
              <p className="text-gray-600">
                Absolutely! The Free Explorer plan is free forever with no credit card required.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="font-bold text-lg text-gray-800 mb-2">
                Can I switch plans later?
              </h3>
              <p className="text-gray-600">
                Of course! Upgrade or downgrade anytime. Your progress is always saved!
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-600 mb-4">
            Not sure which plan is right for you?
          </p>
          <Link
            href="/"
            className="text-purple-600 font-bold hover:text-purple-700 underline"
          >
            Learn more about our features →
          </Link>
        </div>
      </div>
    </div>
  );
}
