'use client';

import { useState, useEffect } from 'react';
import { Question } from '@/lib/math';
import NumberLineRenderer from './NumberLineRenderer';

interface MathQuestionProps {
  moduleName: string;
  level: 'קל' | 'בינוני' | 'קשה';
  onAnswerChecked?: (isCorrect: boolean) => void;
}

export default function MathQuestion({ moduleName, level, onAnswerChecked }: MathQuestionProps) {
  const [question, setQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<{
    show: boolean;
    isCorrect: boolean;
    message: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ correct: 0, total: 0 });

  const fetchQuestion = async () => {
    setLoading(true);
    setFeedback(null);
    setUserAnswer('');

    try {
      const response = await fetch('/api/math/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moduleName, level }),
      });

      const data = await response.json();
      if (data.success) {
        setQuestion(data.question);
      } else {
        console.error('Failed to fetch question:', data.error);
      }
    } catch (error) {
      console.error('Error fetching question:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, [moduleName, level]);

  const handleSubmit = () => {
    if (!question || !userAnswer.trim()) return;

    const isCorrect = checkAnswer(userAnswer, question.correctAnswer);
    setStats((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));

    // Notify parent component if callback provided
    if (onAnswerChecked) {
      onAnswerChecked(isCorrect);
    }

    setFeedback({
      show: true,
      isCorrect,
      message: isCorrect
        ? '🎉 נכון מאוד! כל הכבוד!'
        : `😞 לא נכון. התשובה הנכונה היא: ${question.correctAnswer}`,
    });
  };

  const checkAnswer = (user: string, correct: string | number): boolean => {
    if (typeof correct === 'number') {
      return parseFloat(user) === correct;
    }
    // Normalize whitespace for string comparison
    const normalize = (s: string) => s.replace(/\s+/g, ' ').trim();
    return normalize(user) === normalize(correct.toString());
  };

  if (loading && !question) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg max-w-2xl mx-auto text-center">
        <div className="text-6xl mb-4 animate-bounce">🎓</div>
        <p className="text-lg text-gray-600">טוען שאלה...</p>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg max-w-2xl mx-auto text-center">
        <p className="text-lg text-gray-600">אין שאלה זמינה</p>
      </div>
    );
  }

  const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl p-8 shadow-xl max-w-2xl mx-auto" dir="rtl">
      {/* Stats Bar */}
      <div className="flex justify-between items-center mb-6 p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl">
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{stats.total}</div>
          <div className="text-sm text-gray-600">שאלות</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{stats.correct}</div>
          <div className="text-sm text-gray-600">נכונות</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{accuracy}%</div>
          <div className="text-sm text-gray-600">דיוק</div>
        </div>
      </div>

      {/* Visual Component (if present) */}
      {question.visualData && (
        <div className="mb-6">
          <NumberLineRenderer data={question.visualData} />
        </div>
      )}

      {/* Question */}
      <div className="mb-6 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl">
        <h3 className="text-3xl font-bold text-center text-gray-800">
          <div dir="ltr" className="inline-block text-left">
            {question.question}
          </div>
        </h3>
      </div>

      {/* Input or Choice Buttons */}
      {question.type === 'choice' || question.type === 'visual-choice' ? (
        <div className="mb-4 flex gap-4 justify-center">
          {question.choices?.map((choice, index) => (
            <button
              key={index}
              onClick={() => setUserAnswer(choice.toString())}
              disabled={feedback?.show}
              className={`px-8 py-4 text-xl font-bold rounded-xl transition-all transform hover:scale-105 ${
                userAnswer === choice.toString()
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } ${feedback?.show ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {choice}
            </button>
          ))}
        </div>
      ) : (
        <div className="mb-4">
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !feedback?.show && handleSubmit()}
            className="w-full px-6 py-4 text-xl border-3 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none text-center font-bold"
            placeholder="הכניסי את התשובה כאן..."
            disabled={feedback?.show}
            autoFocus
          />
        </div>
      )}

      {/* Feedback */}
      {feedback?.show && (
        <div
          className={`mb-6 p-6 rounded-xl text-center text-lg font-medium ${
            feedback.isCorrect
              ? 'bg-green-100 text-green-700 border-2 border-green-300'
              : 'bg-red-100 text-red-700 border-2 border-red-300'
          }`}
        >
          {feedback.message}
          {question.explanation && !feedback.isCorrect && (
            <div className="mt-3 text-sm opacity-80">
              💡 {question.explanation}
            </div>
          )}
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-3">
        {!feedback?.show ? (
          <button
            onClick={handleSubmit}
            disabled={!userAnswer.trim()}
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl text-xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            בדקי תשובה ✓
          </button>
        ) : (
          <button
            onClick={fetchQuestion}
            className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 text-white py-4 rounded-xl text-xl font-bold hover:from-green-600 hover:to-teal-600 transition-all transform hover:scale-105"
          >
            שאלה חדשה 🎯
          </button>
        )}
      </div>

      {/* Level Badge */}
      <div className="mt-6 text-center">
        <span className="inline-block px-4 py-2 bg-purple-100 text-purple-600 rounded-full text-sm font-medium">
          רמה: {level}
        </span>
      </div>
    </div>
  );
}
