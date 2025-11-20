'use client';

import { useState } from 'react';
import MathQuestion from '@/components/math/MathQuestion';
import { getAllModules, getModuleNames } from '@/lib/math';

type Level = 'קל' | 'בינוני' | 'קשה';

export default function MathTestPage() {
  const [moduleName, setModuleName] = useState('division');
  const [level, setLevel] = useState<Level>('קל');

  const modules = getModuleNames();
  const levels: Level[] = ['קל', 'בינוני', 'קשה'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 via-blue-100 to-pink-100 py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            Math Engine Test 🎯
          </h1>
          <p className="text-lg text-gray-600">
            Testing the Headless Math Engine Integration
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl p-6 shadow-lg max-w-2xl mx-auto mb-8">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Module Selector */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Select Module 📚
              </label>
              <select
                value={moduleName}
                onChange={(e) => setModuleName(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none text-lg"
              >
                {modules.map((mod) => (
                  <option key={mod} value={mod}>
                    {mod}
                  </option>
                ))}
              </select>
            </div>

            {/* Level Selector */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Select Level 🎚️
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as Level)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none text-lg"
              >
                {levels.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Math Question Component */}
        <MathQuestion key={`${moduleName}-${level}`} moduleName={moduleName} level={level} />

        {/* Info Panel */}
        <div className="bg-white rounded-2xl p-6 shadow-lg max-w-2xl mx-auto mt-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Integration Status ✅
          </h2>
          <div className="space-y-2 text-gray-600">
            <p>✓ Headless math engine extracted from Emma_math_lab.html</p>
            <p>✓ TypeScript modules in lib/math/</p>
            <p>✓ Backend API route at /api/math/generate</p>
            <p>✓ React component with state management</p>
            <p>✓ Hebrew RTL support</p>
            <p>✓ Real-time stats tracking</p>
          </div>

          <div className="mt-6 p-4 bg-purple-50 rounded-xl">
            <p className="text-sm text-purple-700">
              <strong>Available Modules:</strong> {modules.join(', ')}
            </p>
            <p className="text-sm text-purple-700 mt-2">
              <strong>Current Selection:</strong> {moduleName} @ {level}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="text-center mt-8">
          <a
            href="/"
            className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-bold hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
