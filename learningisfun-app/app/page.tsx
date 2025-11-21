import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-100 via-pink-100 to-purple-100">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="mb-8">
          <h1 className="text-5xl md:text-7xl font-bold text-purple-600 mb-4">
            LearningIsFun! 🎉
          </h1>
          <p className="text-2xl md:text-3xl text-pink-500 font-medium">
            Where Learning Feels Like Playing!
          </p>
        </div>

        <div className="text-6xl mb-8 animate-bounce">
          📚✨🚀
        </div>

        <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto mb-8">
          Join thousands of kids in grades 3-5 who are having a blast while
          learning math, reading, science, and more!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/dashboard"
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full text-xl font-bold hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all shadow-lg"
          >
            Start Learning! 🎮
          </Link>
          <Link
            href="/pricing"
            className="bg-white text-purple-600 px-8 py-4 rounded-full text-xl font-bold border-3 border-purple-500 hover:bg-purple-50 transform hover:scale-105 transition-all shadow-lg"
          >
            See Plans 💫
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center text-purple-600 mb-12">
          Why Kids Love Us! 💖
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="text-5xl mb-4">🎯</div>
            <h3 className="text-2xl font-bold text-orange-500 mb-3">
              Fun Challenges
            </h3>
            <p className="text-gray-600">
              Exciting quizzes and games that make learning feel like an adventure!
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="text-5xl mb-4">🏆</div>
            <h3 className="text-2xl font-bold text-green-500 mb-3">
              Earn Rewards
            </h3>
            <p className="text-gray-600">
              Collect badges, stars, and trophies as you complete lessons!
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="text-5xl mb-4">📊</div>
            <h3 className="text-2xl font-bold text-blue-500 mb-3">
              Track Progress
            </h3>
            <p className="text-gray-600">
              Parents can see how you&apos;re doing and cheer you on!
            </p>
          </div>
        </div>
      </section>

      {/* Subjects Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center text-purple-600 mb-12">
          What You&apos;ll Learn! 📖
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-red-100 rounded-2xl p-6 text-center hover:bg-red-200 transition-colors">
            <div className="text-4xl mb-2">➕</div>
            <p className="font-bold text-red-600">Math</p>
          </div>
          <div className="bg-blue-100 rounded-2xl p-6 text-center hover:bg-blue-200 transition-colors">
            <div className="text-4xl mb-2">📖</div>
            <p className="font-bold text-blue-600">Reading</p>
          </div>
          <div className="bg-green-100 rounded-2xl p-6 text-center hover:bg-green-200 transition-colors">
            <div className="text-4xl mb-2">🔬</div>
            <p className="font-bold text-green-600">Science</p>
          </div>
          <div className="bg-yellow-100 rounded-2xl p-6 text-center hover:bg-yellow-200 transition-colors">
            <div className="text-4xl mb-2">✍️</div>
            <p className="font-bold text-yellow-600">Writing</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl p-12 text-white">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Start Your Adventure? 🚀
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join LearningIsFun today - it&apos;s free to get started!
          </p>
          <Link
            href="/dashboard"
            className="bg-white text-purple-600 px-8 py-4 rounded-full text-xl font-bold hover:bg-gray-100 transform hover:scale-105 transition-all inline-block shadow-lg"
          >
            Let&apos;s Go! ✨
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-purple-600 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg mb-2">Made with ❤️ for young learners</p>
          <p className="opacity-80">© 2024 LearningIsFun. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
