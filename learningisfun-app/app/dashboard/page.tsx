'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getAllModules } from '@/lib/math';
import MathQuestion from '@/components/math/MathQuestion';

type Level = 'קל' | 'בינוני' | 'קשה';

interface Achievement {
  name: string;
  emoji: string;
  earned: boolean;
}

const achievements: Achievement[] = [
  { name: 'First Lesson', emoji: '🌟', earned: true },
  { name: 'Week Streak', emoji: '🔥', earned: true },
  { name: 'Math Master', emoji: '🧮', earned: true },
  { name: 'Bookworm', emoji: '📚', earned: false },
  { name: 'Science Star', emoji: '⭐', earned: false },
  { name: 'Perfect Score', emoji: '💯', earned: false },
];

const dailyChallenges = [
  { id: 'math-lessons', title: 'Complete 3 Math Lessons', progress: 2, total: 3, reward: '50 coins' },
  { id: 'reading-time', title: 'Read for 15 minutes', progress: 10, total: 15, reward: '30 coins' },
  { id: 'new-subject', title: 'Try a new subject', progress: 0, total: 1, reward: '100 coins' },
];

export default function DashboardPage() {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<Level>('קל');
  const [sessionStats, setSessionStats] = useState({ correct: 0, total: 0 });

  const mathModules = getAllModules();
  const levels: Level[] = ['קל', 'בינוני', 'קשה'];

  const handleModuleSelect = (moduleId: string) => {
    setSelectedModule(moduleId);
    setSessionStats({ correct: 0, total: 0 }); // Reset stats when changing module
  };

  const handleBackToDashboard = () => {
    setSelectedModule(null);
  };

  const handleAnswerChecked = (isCorrect: boolean) => {
    setSessionStats((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));
  };

  // If a module is selected, show the practice interface
  if (selectedModule) {
    const currentModule = mathModules.find((m) => m.id === selectedModule);
    const accuracy = sessionStats.total > 0 ? Math.round((sessionStats.correct / sessionStats.total) * 100) : 0;

    return (
      <div className="min-h-screen bg-gradient-to-b from-green-100 via-blue-100 to-purple-100">
        <div className="container mx-auto px-4 py-8">
          {/* Practice Header */}
          <div className="bg-white rounded-3xl p-6 shadow-xl mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleBackToDashboard}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl font-medium transition-colors"
                >
                  ← חזרה
                </button>
                <div>
                  <h1 className="text-3xl font-bold text-purple-600">
                    {currentModule?.icon} {currentModule?.name}
                  </h1>
                  <p className="text-gray-600 text-sm" dir="rtl">
                    {currentModule?.description}
                  </p>
                </div>
              </div>

              {/* Session Stats */}
              <div className="flex gap-4">
                <div className="text-center bg-purple-50 rounded-xl px-4 py-2">
                  <div className="text-2xl font-bold text-purple-600">{sessionStats.total}</div>
                  <div className="text-xs text-gray-600">Questions</div>
                </div>
                <div className="text-center bg-green-50 rounded-xl px-4 py-2">
                  <div className="text-2xl font-bold text-green-600">{sessionStats.correct}</div>
                  <div className="text-xs text-gray-600">Correct</div>
                </div>
                <div className="text-center bg-blue-50 rounded-xl px-4 py-2">
                  <div className="text-2xl font-bold text-blue-600">{accuracy}%</div>
                  <div className="text-xs text-gray-600">Accuracy</div>
                </div>
              </div>
            </div>

            {/* Level Selector */}
            <div className="mt-6 flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700">Level:</span>
              <div className="flex gap-2">
                {levels.map((level) => (
                  <button
                    key={level}
                    onClick={() => setSelectedLevel(level)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${
                      selectedLevel === level
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Math Question Component */}
          <MathQuestion
            key={`${selectedModule}-${selectedLevel}`}
            moduleName={selectedModule}
            level={selectedLevel}
            onAnswerChecked={handleAnswerChecked}
          />
        </div>
      </div>
    );
  }

  // Default dashboard view
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 via-blue-100 to-purple-100">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="bg-white rounded-3xl p-8 shadow-xl mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-purple-600 mb-2">Welcome back, Super Star! 🌟</h1>
              <p className="text-gray-600 text-lg">You&apos;re on a 5-day learning streak! Keep it up!</p>
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
          {/* Main Content - Math Modules */}
          <div className="md:col-span-2">
            {/* Math Practice Modules */}
            <div className="bg-white rounded-3xl p-8 shadow-xl mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Math Practice 🧮</h2>

              <div className="grid sm:grid-cols-2 gap-4">
                {mathModules.map((module) => (
                  <button
                    key={module.id}
                    onClick={() => handleModuleSelect(module.id)}
                    className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 hover:shadow-lg transition-all transform hover:scale-105 text-left"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-4xl">{module.icon}</span>
                        <div>
                          <span className="font-bold text-gray-800 block" dir="rtl">
                            {module.name}
                          </span>
                          <span className="text-xs text-gray-500">{module.id}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3" dir="rtl">
                      {module.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs bg-purple-100 text-purple-600 px-3 py-1 rounded-full font-medium">
                        Start Practice →
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Daily Challenges */}
            <div className="bg-white rounded-3xl p-8 shadow-xl">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Daily Challenges 🎯</h2>

              <div className="space-y-4">
                {dailyChallenges.map((challenge) => (
                  <div
                    key={challenge.id}
                    className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-800">{challenge.title}</span>
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
              <h2 className="text-xl font-bold text-gray-800 mb-4">Your Stats 📊</h2>
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
              <h2 className="text-xl font-bold text-gray-800 mb-4">Achievements 🏆</h2>
              <div className="grid grid-cols-3 gap-3">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.name}
                    className={`text-center p-3 rounded-xl ${
                      achievement.earned ? 'bg-yellow-100' : 'bg-gray-100 opacity-50'
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
                <button
                  onClick={() => handleModuleSelect(mathModules[Math.floor(Math.random() * mathModules.length)].id)}
                  className="w-full bg-white/20 hover:bg-white/30 py-3 rounded-xl font-medium transition-colors"
                >
                  Random Quiz 🎲
                </button>
                <Link
                  href="/math-test"
                  className="block w-full bg-white/20 hover:bg-white/30 py-3 rounded-xl font-medium transition-colors text-center"
                >
                  Practice Mode 🎯
                </Link>
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
