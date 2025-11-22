'use client';

import Link from "next/link";
import { useTranslation } from '@/lib/i18n';

interface WeeklyActivity {
  day: string;
  minutes: number;
}

interface SubjectProgress {
  name: string;
  emoji: string;
  lessonsCompleted: number;
  totalLessons: number;
  accuracy: number;
  color: string;
}

export default function ParentPortalPage() {
  const { t } = useTranslation();

  const weeklyActivity: WeeklyActivity[] = [
    { day: "mon", minutes: 45 },
    { day: "tue", minutes: 30 },
    { day: "wed", minutes: 60 },
    { day: "thu", minutes: 25 },
    { day: "fri", minutes: 50 },
    { day: "sat", minutes: 15 },
    { day: "sun", minutes: 40 },
  ];

  const subjectProgress: SubjectProgress[] = [
    {
      name: t('parentPortal.subjects.math'),
      emoji: "➕",
      lessonsCompleted: 24,
      totalLessons: 32,
      accuracy: 85,
      color: "bg-red-500",
    },
    {
      name: t('parentPortal.subjects.reading'),
      emoji: "📖",
      lessonsCompleted: 18,
      totalLessons: 30,
      accuracy: 92,
      color: "bg-blue-500",
    },
    {
      name: t('parentPortal.subjects.science'),
      emoji: "🔬",
      lessonsCompleted: 12,
      totalLessons: 28,
      accuracy: 78,
      color: "bg-green-500",
    },
    {
      name: t('parentPortal.subjects.writing'),
      emoji: "✍️",
      lessonsCompleted: 8,
      totalLessons: 25,
      accuracy: 88,
      color: "bg-yellow-500",
    },
  ];

  const recentActivity = [
    {
      action: t('parentPortal.activity.completedMath'),
      subject: t('parentPortal.activity.multiplicationTables'),
      time: t('parentPortal.activity.hoursAgo'),
      score: "9/10",
    },
    {
      action: t('parentPortal.activity.earnedBadge'),
      subject: t('parentPortal.activity.weekStreakMaster'),
      time: t('parentPortal.activity.yesterday'),
      score: null,
    },
    {
      action: t('parentPortal.activity.completedReading'),
      subject: t('parentPortal.activity.storyComprehension'),
      time: t('parentPortal.activity.yesterday'),
      score: "8/10",
    },
    {
      action: t('parentPortal.activity.completedQuiz'),
      subject: t('parentPortal.activity.plantsPhotosynthesis'),
      time: t('parentPortal.activity.daysAgo'),
      score: "7/10",
    },
  ];
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-3xl p-8 shadow-xl mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-indigo-600 mb-2">
                {t('parentPortal.title')}
              </h1>
              <p className="text-gray-600 text-lg">
                {t('parentPortal.subtitle')}
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-3">
              <button className="bg-indigo-100 text-indigo-600 px-4 py-2 rounded-xl font-medium hover:bg-indigo-200 transition-colors">
                {t('parentPortal.settings')}
              </button>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-indigo-700 transition-colors">
                {t('parentPortal.exportReport')}
              </button>
            </div>
          </div>
        </div>

        {/* Re-auth Notice */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-xl mb-8">
          <div className="flex items-center">
            <span className="text-2xl mr-3">🔐</span>
            <div>
              <p className="font-medium text-yellow-800">
                {t('parentPortal.secureAccess.title')}
              </p>
              <p className="text-sm text-yellow-700">
                {t('parentPortal.secureAccess.message')}
              </p>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <p className="text-gray-500 text-sm mb-1">{t('parentPortal.stats.totalTime')}</p>
            <p className="text-3xl font-bold text-indigo-600">8h 30m</p>
            <p className="text-green-500 text-sm mt-1">{t('parentPortal.stats.thisWeek')}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <p className="text-gray-500 text-sm mb-1">{t('parentPortal.stats.lessonsDone')}</p>
            <p className="text-3xl font-bold text-green-600">62</p>
            <p className="text-green-500 text-sm mt-1">{t('parentPortal.stats.lessonsThisWeek')}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <p className="text-gray-500 text-sm mb-1">{t('parentPortal.stats.avgAccuracy')}</p>
            <p className="text-3xl font-bold text-blue-600">86%</p>
            <p className="text-green-500 text-sm mt-1">{t('parentPortal.stats.improvement')}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <p className="text-gray-500 text-sm mb-1">{t('parentPortal.stats.currentStreak')}</p>
            <p className="text-3xl font-bold text-orange-600">5 days</p>
            <p className="text-orange-500 text-sm mt-1">{t('parentPortal.stats.keepGoing')}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            {/* Weekly Activity */}
            <div className="bg-white rounded-3xl p-8 shadow-xl">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {t('parentPortal.weeklyActivity')}
              </h2>
              <div className="flex items-end justify-between h-48 gap-2">
                {weeklyActivity.map((day) => (
                  <div key={day.day} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-gradient-to-t from-indigo-500 to-purple-500 rounded-t-lg transition-all hover:from-indigo-600 hover:to-purple-600"
                      style={{ height: `${(day.minutes / 60) * 100}%` }}
                      title={`${day.minutes} minutes`}
                    ></div>
                    <span className="text-sm text-gray-600 mt-2">{t(`parentPortal.weekDays.${day.day}`)}</span>
                    <span className="text-xs text-gray-400">{day.minutes}m</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Subject Progress */}
            <div className="bg-white rounded-3xl p-8 shadow-xl">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {t('parentPortal.subjectProgress')}
              </h2>
              <div className="space-y-6">
                {subjectProgress.map((subject) => (
                  <div key={subject.name}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{subject.emoji}</span>
                        <span className="font-medium text-gray-800">
                          {subject.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-gray-600">
                          {subject.lessonsCompleted}/{subject.totalLessons} {t('parentPortal.lessonsLabel')}
                        </span>
                        <span className="ml-3 text-sm font-medium text-green-600">
                          {subject.accuracy}% {t('parentPortal.accuracyLabel')}
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3">
                      <div
                        className={`${subject.color} h-3 rounded-full transition-all`}
                        style={{
                          width: `${(subject.lessonsCompleted / subject.totalLessons) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Recent Activity */}
            <div className="bg-white rounded-3xl p-6 shadow-xl">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                {t('parentPortal.recentActivity')}
              </h2>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                  >
                    <p className="font-medium text-gray-800 text-sm">
                      {activity.action}
                    </p>
                    <p className="text-gray-500 text-sm">{activity.subject}</p>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-gray-400">{activity.time}</span>
                      {activity.score && (
                        <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
                          {activity.score}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl p-6 shadow-xl text-white">
              <h2 className="text-xl font-bold mb-4">{t('parentPortal.recommendations')}</h2>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  {t('parentPortal.recommendationsList.science')}
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  {t('parentPortal.recommendationsList.reading')}
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  {t('parentPortal.recommendationsList.weekend')}
                </li>
              </ul>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-3xl p-6 shadow-xl">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                {t('parentPortal.parentControls')}
              </h2>
              <div className="space-y-3">
                <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-medium transition-colors text-left px-4">
                  {t('parentPortal.controls.setGoals')}
                </button>
                <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-medium transition-colors text-left px-4">
                  {t('parentPortal.controls.manageScreenTime')}
                </button>
                <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-medium transition-colors text-left px-4">
                  {t('parentPortal.controls.notifications')}
                </button>
                <Link
                  href="/dashboard"
                  className="block w-full bg-indigo-100 hover:bg-indigo-200 text-indigo-600 py-3 rounded-xl font-medium transition-colors text-center"
                >
                  {t('parentPortal.controls.viewAsChild')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
