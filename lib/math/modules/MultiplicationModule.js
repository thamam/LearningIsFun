/**
 * MultiplicationModule - Headless Multiplication Practice
 *
 * Extracted from: src/math/Emma_math_lab.html (lines 2865-3039)
 * Zero DOM dependencies - Returns View Objects for rendering
 *
 * Question Types:
 * - missingMultiplier: a × ___ = c
 * - missingMultiplicand: ___ × b = c
 * - missingProduct: a × b = ___
 * - division: If a × b = c, then c ÷ a = ___
 *
 * All questions require numeric input (no multiple choice).
 */

class MultiplicationModule {
    /**
     * @param {Object} config - Configuration options
     * @param {string} config.initialLevel - Starting difficulty ('קל', 'בינוני', 'קשה')
     * @param {Object} config.statistics - Initial statistics
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

        this.questionTypes = [
            'missingMultiplier',
            'missingMultiplicand',
            'missingProduct',
            'division'
        ];

        this.difficultyConfig = {
            'קל': { min: 1, max: 5 },
            'בינוני': { min: 1, max: 10 },
            'קשה': { min: 1, max: 12 }
        };

        this.hebrewText = {
            encouragements: {
                correct: ['מעולה!', 'פנטסטי!', 'את גאונית!', 'כל הכבוד!', 'מושלם!'],
                wrong: ['לא נורא!', 'ננסה שוב!', 'כמעט!', 'אפשר ללמוד מטעויות!', 'בפעם הבאה!']
            },
            correctVoice: 'כל הכבוד אמה!',
            wrongTip: 'תרגלי את לוח הכפל!'
        };

        // LTR embedding characters for proper RTL display
        this.LTR_START = '\u202A';
        this.LTR_END = '\u202C';
    }

    /**
     * Generate a new multiplication question
     * @param {string} level - Difficulty level ('קל', 'בינוני', 'קשה')
     * @returns {Object} View Object for rendering
     */
    generateQuestion(level = this.currentLevel) {
        const type = this.questionTypes[Math.floor(Math.random() * this.questionTypes.length)];
        const range = this.difficultyConfig[level];

        // Generate two random numbers within range
        const num1 = Math.floor(Math.random() * range.max) + range.min;
        const num2 = Math.floor(Math.random() * range.max) + range.min;
        const product = num1 * num2;

        let questionText, correctAnswer;

        switch (type) {
            case 'missingMultiplier':
                // a × ___ = c
                questionText = `${this.LTR_START}${num1} × ___ = ${product}${this.LTR_END}`;
                correctAnswer = num2;
                break;

            case 'missingMultiplicand':
                // ___ × b = c
                questionText = `${this.LTR_START}___ × ${num2} = ${product}${this.LTR_END}`;
                correctAnswer = num1;
                break;

            case 'missingProduct':
                // a × b = ___
                questionText = `${this.LTR_START}${num1} × ${num2} = ___${this.LTR_END}`;
                correctAnswer = product;
                break;

            case 'division':
                // If a × b = c, then c ÷ a = ___
                const eq1 = `${this.LTR_START}${num1} × ${num2} = ${product}${this.LTR_END}`;
                const eq2 = `${this.LTR_START}${product} ÷ ${num1} = ___${this.LTR_END}`;
                questionText = `אם ${eq1}, אז ${eq2}`;
                correctAnswer = num2;
                break;

            default:
                throw new Error(`Unknown question type: ${type}`);
        }

        return {
            type: 'question',
            module: 'multiplication',
            questionText: questionText,
            questionType: 'input',
            inputPlaceholder: 'הכניסי מספר',
            correctAnswer: correctAnswer,
            showCheckButton: true,
            focus: true,
            metadata: {
                num1,
                num2,
                product,
                questionType: type,
                level
            }
        };
    }

    /**
     * Check user answer and return feedback
     * @param {string|number} userAnswer - User's answer
     * @param {number} correctAnswer - Correct answer
     * @param {Object} currentQuestion - Current question object (for context)
     * @returns {Object} View Object for feedback rendering
     */
    checkAnswer(userAnswer, correctAnswer, currentQuestion) {
        const userNum = parseFloat(userAnswer);

        if (isNaN(userNum)) {
            return {
                type: 'validation-error',
                message: 'אנא הכניסי מספר!'
            };
        }

        const isCorrect = userNum === correctAnswer;

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
        const difficultyChange = this._adjustDifficulty();

        // Build feedback View Object
        const encouragement = this._getRandomEncouragement(isCorrect);

        return {
            type: 'feedback',
            module: 'multiplication',
            isCorrect: isCorrect,
            feedbackType: isCorrect ? 'correct' : 'wrong',
            feedbackMessage: isCorrect
                ? `✅ ${encouragement} תשובה נכונה!`
                : `❌ ${encouragement}`,
            voiceMessage: isCorrect ? this.hebrewText.correctVoice : null,
            correctAnswerDisplay: isCorrect ? null : `התשובה הנכונה: ${correctAnswer}`,
            explanationMessage: isCorrect ? null : `ההסבר: ${this.hebrewText.wrongTip}`,
            statistics: { ...this.statistics },
            difficultyChange: difficultyChange,
            autoAdvance: isCorrect,
            autoAdvanceDelay: 1500, // milliseconds
            celebrationTrigger: this.statistics.totalQuestions % 10 === 0,
            showNewQuestionButton: !isCorrect
        };
    }

    // ========================================
    // PRIVATE METHODS
    // ========================================

    /**
     * Get random encouragement message
     * @private
     */
    _getRandomEncouragement(isCorrect) {
        const array = isCorrect
            ? this.hebrewText.encouragements.correct
            : this.hebrewText.encouragements.wrong;
        return array[Math.floor(Math.random() * array.length)];
    }

    /**
     * Adjust difficulty based on consecutive correct/wrong answers
     * @private
     * @returns {Object|null} Difficulty change info or null
     */
    _adjustDifficulty() {
        let changed = false;
        let newLevel = this.currentLevel;
        let direction = null;

        // Level up after 3 consecutive correct
        if (this.statistics.consecutiveCorrect >= 3 && this.currentLevel !== 'קשה') {
            changed = true;
            direction = 'up';
            if (this.currentLevel === 'קל') {
                newLevel = 'בינוני';
            } else if (this.currentLevel === 'בינוני') {
                newLevel = 'קשה';
            }
            this.currentLevel = newLevel;
            this.statistics.consecutiveCorrect = 0;
        }
        // Level down after 2 consecutive wrong
        else if (this.statistics.consecutiveWrong >= 2 && this.currentLevel !== 'קל') {
            changed = true;
            direction = 'down';
            if (this.currentLevel === 'קשה') {
                newLevel = 'בינוני';
            } else if (this.currentLevel === 'בינוני') {
                newLevel = 'קל';
            }
            this.currentLevel = newLevel;
            this.statistics.consecutiveWrong = 0;
        }

        return changed ? { changed: true, newLevel, direction } : null;
    }

    /**
     * Get current statistics
     * @returns {Object} Current statistics
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
     * Reset statistics
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
    module.exports = MultiplicationModule;
}

// Export for ES6
if (typeof exports !== 'undefined') {
    exports.MultiplicationModule = MultiplicationModule;
}
