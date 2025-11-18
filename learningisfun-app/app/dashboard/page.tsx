import Link from "next/link";

interface Subject {
  name: string;
  emoji: string;
  progress: number;
  color: string;
  bgColor: string;
}

interface Achievement {
  name: string;
  emoji: string;
  earned: boolean;
}

const subjects: Subject[] = [
  { name: "Math", emoji: "➕", progress: 75, color: "bg-red-500", bgColor: "bg-red-100" },
  { name: "Reading", emoji: "📖", progress: 60, color: "bg-blue-500", bgColor: "bg-blue-100" },
  { name: "Science", emoji: "🔬", progress: 45, color: "bg-green-500", bgColor: "bg-green-100" },
  { name: "Writing", emoji: "✍️", progress: 30, color: "bg-yellow-500", bgColor: "bg-yellow-100" },
];

const achievements: Achievement[] = [
  { name: "First Lesson", emoji: "🌟", earned: true },
  { name: "Week Streak", emoji: "🔥", earned: true },
  { name: "Math Master", emoji: "🧮", earned: true },
  { name: "Bookworm", emoji: "📚", earned: false },
  { name: "Science Star", emoji: "⭐", earned: false },
  { name: "Perfect Score", emoji: "💯", earned: false },
];

const dailyChallenges = [
  { title: "Complete 3 Math Lessons", progress: 2, total: 3, reward: "50 coins" },
  { title: "Read for 15 minutes", progress: 10, total: 15, reward: "30 coins" },
  { title: "Try a new subject", progress: 0, total: 1, reward: "100 coins" },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 via-blue-100 to-purple-100">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="bg-white rounded-3xl p-8 shadow-xl mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-purple-600 mb-2">
                Welcome back, Super Star! 🌟
              </h1>
              <p className="text-gray-600 text-lg">
                You&apos;re on a 5-day learning streak! Keep it up!
              </p>
            </div>
            <div className="mt-4 md:mt-0 text-center">
              <div className="text-5xl mb-2">🔥</div>
              <span className="bg-orange-100 text-orange-600 px-4 py-2 rounded-full font-bold">
                5 Day Streak!
              </span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content - Subjects */}
          <div className="md:col-span-2">
            {/* Continue Learning */}
            <div className="bg-white rounded-3xl p-8 shadow-xl mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Continue Learning 📚
              </h2>

              <div className="grid sm:grid-cols-2 gap-4">
                {subjects.map((subject) => (
                  <div
                    key={subject.name}
                    className={`${subject.bgColor} rounded-2xl p-6 hover:shadow-lg transition-shadow cursor-pointer`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <span className="text-3xl mr-3">{subject.emoji}</span>
                        <span className="font-bold text-gray-800">{subject.name}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-600">
                        {subject.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-white rounded-full h-3">
                      <div
                        className={`${subject.color} h-3 rounded-full transition-all`}
                        style={{ width: `${subject.progress}%` }}
                      ></div>
                    </div>
                    <button className="mt-4 w-full bg-white text-gray-700 py-2 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                      Continue →
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Daily Challenges */}
            <div className="bg-white rounded-3xl p-8 shadow-xl">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Daily Challenges 🎯
              </h2>

              <div className="space-y-4">
                {dailyChallenges.map((challenge, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-800">
                        {challenge.title}
                      </span>
                      <span className="text-sm bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">
                        🪙 {challenge.reward}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-white rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                          style={{
                            width: `${(challenge.progress / challenge.total) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">
                        {challenge.progress}/{challenge.total}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Stats */}
            <div className="bg-white rounded-3xl p-6 shadow-xl">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Your Stats 📊
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Lessons</span>
                  <span className="font-bold text-purple-600">47</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Coins Earned</span>
                  <span className="font-bold text-yellow-600">🪙 1,250</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Badges</span>
                  <span className="font-bold text-green-600">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Time Spent</span>
                  <span className="font-bold text-blue-600">8h 30m</span>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-3xl p-6 shadow-xl">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Achievements 🏆
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.name}
                    className={`text-center p-3 rounded-xl ${
                      achievement.earned
                        ? "bg-yellow-100"
                        : "bg-gray-100 opacity-50"
                    }`}
                    title={achievement.name}
                  >
                    <span className="text-2xl">{achievement.emoji}</span>
                  </div>
                ))}
              </div>
              <button className="mt-4 w-full text-purple-600 font-medium hover:text-purple-700">
                View All →
              </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl p-6 shadow-xl text-white">
              <h2 className="text-xl font-bold mb-4">Quick Start ⚡</h2>
              <div className="space-y-3">
                <button className="w-full bg-white/20 hover:bg-white/30 py-3 rounded-xl font-medium transition-colors">
                  Random Quiz 🎲
                </button>
                <button className="w-full bg-white/20 hover:bg-white/30 py-3 rounded-xl font-medium transition-colors">
                  Practice Mode 🎯
                </button>
                <Link
                  href="/parent-portal"
                  className="block w-full bg-white/20 hover:bg-white/30 py-3 rounded-xl font-medium transition-colors text-center"
                >
                  Parent Portal 👨‍👩‍👧
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
