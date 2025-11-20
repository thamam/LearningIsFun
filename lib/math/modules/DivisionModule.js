/**
 * Division Module (Headless)
 *
 * Pure JavaScript class for division practice.
 * Zero DOM dependencies - returns JSON View Objects.
 *
 * Extracted from: src/math/js/modules/division_module.js
 * Date: 2025-11-20
 */

class DivisionModule {
    /**
     * Initialize division module
     * @param {object} config - Configuration options
     * @param {string} config.initialLevel - Starting difficulty ('קל' | 'בינוני' | 'קשה')
     * @param {object} config.statistics - Existing statistics (for session continuity)
     */
    constructor(config = {}) {
        this.currentLevel = config.initialLevel || 'קל';

        this.statistics = config.statistics || {
            totalQuestions: 0,
            correctAnswers: 0,
            currentStreak: 0,
            bestStreak: 0,
            consecutiveCorrect: 0,
            consecutiveWrong: 0
        };

        // Difficulty configuration (extracted from getDivisionRange)
        this.difficultyConfig = {
            'קל': {
                maxQuotient: 10,
                divisors: [2, 3, 4, 5]
            },
            'בינוני': {
                maxQuotient: 12,
                divisors: [2, 3, 4, 5, 6, 7, 8]
            },
            'קשה': {
                maxQuotient: 15,
                divisors: [2, 3, 4, 5, 6, 7, 8, 9, 10, 12]
            }
        };

        // Hebrew text resources (extracted from checkDivisionAnswer)
        this.hebrewText = {
            encouragements: {
                correct: ['מעולה!', 'פנטסטי!', 'את גאונית!', 'כל הכבוד!', 'מושלם!', 'יופי!'],
                wrong: ['לא נורא!', 'ננסה שוב!', 'כמעט!', 'אפשר ללמוד מטעויות!', 'בפעם הבאה!']
            },
            questionPrefixes: {
                basic: 'חשבי:',
                missing: 'מצאי את המספר החסר:'
            },
            wordProblems: [
                'לאמה יש {total} עוגיות. היא רוצה לחלק אותן שווה ב-{groups} קבוצות. כמה עוגיות בכל קבוצה?',
                'יש {total} תפוחים ו-{groups} סלים. כמה תפוחים יהיו בכל סל אם נחלק שווה?',
                'אמה קראה {total} עמודים ב-{groups} ימים, כל יום אותו מספר עמודים. כמה עמודים קראה כל יום?'
            ]
        };
    }

    /**
     * Generate a new division question
     * @param {string} level - Difficulty level ('קל' | 'בינוני' | 'קשה')
     * @returns {object} View Object with question data
     */
    generateQuestion(level = this.currentLevel) {
        const types = ['basicDivision', 'missingDividend', 'missingDivisor', 'wordProblem'];
        const type = types[Math.floor(Math.random() * types.length)];

        const range = this.difficultyConfig[level];
        let questionData;

        switch (type) {
            case 'basicDivision':
                questionData = this._generateBasicDivision(range);
                break;
            case 'missingDividend':
                questionData = this._generateMissingDividend(range);
                break;
            case 'missingDivisor':
                questionData = this._generateMissingDivisor(range);
                break;
            case 'wordProblem':
                questionData = this._generateWordProblem(range);
                break;
        }

        // Return View Object (JSON)
        return {
            type: 'question',
            module: 'division',
            timestamp: Date.now(),
            difficulty: level,

            questionText: questionData.questionText,
            equation: questionData.equation || null,
            showEquation: !!questionData.equation,

            questionType: 'input',  // All division questions use text input
            inputValue: '',
            inputPlaceholder: 'הכניסי תשובה',
            inputType: 'number',
            focus: true,
            showInput: true,

            correctAnswer: questionData.correctAnswer,
            metadata: questionData.metadata || {},

            showCheckButton: true,
            showNextButton: false,
            showHintButton: true,

            hint: questionData.hint || 'חשבי על לוח הכפל!',
            hintVisible: false
        };
    }

    /**
     * Validate user answer
     * @param {string|number} userAnswer - User's answer
     * @param {string|number} correctAnswer - Expected answer
     * @returns {object} View Object with feedback data
     */
    checkAnswer(userAnswer, correctAnswer) {
        // Validation logic
        const isCorrect = parseFloat(userAnswer) === parseFloat(correctAnswer);

        // Update statistics
        this.statistics.totalQuestions++;

        if (isCorrect) {
            this.statistics.correctAnswers++;
            this.statistics.currentStreak++;
            this.statistics.consecutiveCorrect++;
            this.statistics.consecutiveWrong = 0;

            if (this.statistics.currentStreak > this.statistics.bestStreak) {
                this.statistics.bestStreak = this.statistics.currentStreak;
            }
        } else {
            this.statistics.currentStreak = 0;
            this.statistics.consecutiveWrong++;
            this.statistics.consecutiveCorrect = 0;
        }

        // Check for difficulty adjustment
        const difficultyChange = this._checkDifficultyAdjustment();

        // Return View Object (JSON)
        return {
            type: 'feedback',
            module: 'division',
            timestamp: Date.now(),

            isCorrect: isCorrect,
            userAnswer: userAnswer,
            correctAnswer: correctAnswer,

            feedbackType: isCorrect ? 'correct' : 'wrong',
            feedbackMessage: this._getFeedbackMessage(isCorrect),
            encouragement: this._getRandomEncouragement(isCorrect),
            feedbackIcon: isCorrect ? '✅' : '❌',

            explanation: isCorrect ? null : `התשובה הנכונה: ${correctAnswer}`,
            showExplanation: !isCorrect,
            hint: '💡 טיפ: חשבי על לוח הכפל!',

            showCheckButton: false,
            showNextButton: true,
            enableInput: false,

            statistics: {
                totalQuestions: this.statistics.totalQuestions,
                correctAnswers: this.statistics.correctAnswers,
                currentStreak: this.statistics.currentStreak,
                bestStreak: this.statistics.bestStreak,
                accuracy: Math.round((this.statistics.correctAnswers / this.statistics.totalQuestions) * 100),
                scoreDisplay: `${this.statistics.correctAnswers}/${this.statistics.totalQuestions}`
            },

            difficultyChange: difficultyChange,  // 'level_up', 'level_down', null
            newDifficulty: this.currentLevel,

            nextAction: isCorrect ? 'generate_next' : 'show_hint',
            autoAdvance: isCorrect,
            autoAdvanceDelay: 1500,

            showCelebration: this.statistics.totalQuestions % 10 === 0
        };
    }

    // ========================================================================
    // PRIVATE METHODS (Business Logic)
    // ========================================================================

    _generateBasicDivision(range) {
        const divisor = range.divisors[Math.floor(Math.random() * range.divisors.length)];
        const quotient = Math.floor(Math.random() * range.maxQuotient) + 1;
        const dividend = divisor * quotient;

        return {
            questionText: this.hebrewText.questionPrefixes.basic,
            equation: `${dividend} ÷ ${divisor} = ___`,
            correctAnswer: quotient,
            metadata: {
                dividend: dividend,
                divisor: divisor,
                quotient: quotient,
                questionType: 'basicDivision'
            },
            hint: `חשבי: ${divisor} × ? = ${dividend}`
        };
    }

    _generateMissingDividend(range) {
        const divisor = range.divisors[Math.floor(Math.random() * range.divisors.length)];
        const quotient = Math.floor(Math.random() * range.maxQuotient) + 1;
        const dividend = divisor * quotient;

        return {
            questionText: this.hebrewText.questionPrefixes.missing,
            equation: `___ ÷ ${divisor} = ${quotient}`,
            correctAnswer: dividend,
            metadata: {
                dividend: dividend,
                divisor: divisor,
                quotient: quotient,
                questionType: 'missingDividend'
            },
            hint: `חשבי: ${divisor} × ${quotient} = ?`
        };
    }

    _generateMissingDivisor(range) {
        const divisor = range.divisors[Math.floor(Math.random() * range.divisors.length)];
        const quotient = Math.floor(Math.random() * range.maxQuotient) + 1;
        const dividend = divisor * quotient;

        return {
            questionText: this.hebrewText.questionPrefixes.missing,
            equation: `${dividend} ÷ ___ = ${quotient}`,
            correctAnswer: divisor,
            metadata: {
                dividend: dividend,
                divisor: divisor,
                quotient: quotient,
                questionType: 'missingDivisor'
            },
            hint: `חשבי: ${dividend} ÷ ? = ${quotient}`
        };
    }

    _generateWordProblem(range) {
        const problemTemplate = this.hebrewText.wordProblems[
            Math.floor(Math.random() * this.hebrewText.wordProblems.length)
        ];

        const groups = range.divisors[Math.floor(Math.random() * range.divisors.length)];
        const perGroup = Math.floor(Math.random() * range.maxQuotient) + 1;
        const total = groups * perGroup;

        const questionText = problemTemplate
            .replace('{total}', total)
            .replace('{groups}', groups);

        return {
            questionText: questionText,
            equation: null,  // Word problems don't show equation
            correctAnswer: perGroup,
            metadata: {
                total: total,
                groups: groups,
                perGroup: perGroup,
                questionType: 'wordProblem'
            },
            hint: `חשבי: ${total} ÷ ${groups} = ?`
        };
    }

    _getFeedbackMessage(isCorrect) {
        const encouragement = this._getRandomEncouragement(isCorrect);

        if (isCorrect) {
            return `${encouragement} תשובה נכונה!`;
        } else {
            return `${encouragement}`;
        }
    }

    _getRandomEncouragement(isCorrect) {
        const pool = this.hebrewText.encouragements[isCorrect ? 'correct' : 'wrong'];
        return pool[Math.floor(Math.random() * pool.length)];
    }

    _checkDifficultyAdjustment() {
        // Level up after 3 consecutive correct
        if (this.statistics.consecutiveCorrect >= 3 && this.currentLevel !== 'קשה') {
            if (this.currentLevel === 'קל') {
                this.currentLevel = 'בינוני';
            } else if (this.currentLevel === 'בינוני') {
                this.currentLevel = 'קשה';
            }
            this.statistics.consecutiveCorrect = 0;
            return 'level_up';
        }

        // Level down after 2 consecutive wrong
        if (this.statistics.consecutiveWrong >= 2 && this.currentLevel !== 'קל') {
            if (this.currentLevel === 'קשה') {
                this.currentLevel = 'בינוני';
            } else if (this.currentLevel === 'בינוני') {
                this.currentLevel = 'קל';
            }
            this.statistics.consecutiveWrong = 0;
            return 'level_down';
        }

        return null;
    }

    /**
     * Get current statistics
     * @returns {object} Statistics object
     */
    getStatistics() {
        return { ...this.statistics };
    }

    /**
     * Get current difficulty level
     * @returns {string} Current level
     */
    getCurrentLevel() {
        return this.currentLevel;
    }

    /**
     * Reset statistics (new session)
     */
    resetStatistics() {
        this.statistics = {
            totalQuestions: 0,
            correctAnswers: 0,
            currentStreak: 0,
            bestStreak: 0,
            consecutiveCorrect: 0,
            consecutiveWrong: 0
        };
    }
}

// Export for Node.js (CommonJS)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DivisionModule;
}

// Export for ES6 modules
if (typeof exports !== 'undefined') {
    exports.DivisionModule = DivisionModule;
}
