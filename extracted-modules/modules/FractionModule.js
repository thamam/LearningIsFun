/**
 * FractionModule - Headless Fraction Practice
 *
 * Extracted from: src/math/js/modules/fraction_module.js
 * Zero DOM dependencies - Returns View Objects for rendering
 *
 * Question Types:
 * - compare: Compare two fractions (e.g., 3/4 ___ 1/4)
 * - addSameDenominator: Add fractions with same denominator
 * - simplify: Simplify a fraction
 * - fractionToDecimal: Convert fraction to decimal (future use)
 * - decimalToFraction: Convert decimal to fraction (future use)
 */

class FractionModule {
    /**
     * @param {Object} config - Configuration options
     * @param {string} config.initialLevel - Starting difficulty ('קל', 'בינוני', 'קשה')
     * @param {Object} config.statistics - Initial statistics
     * @param {string[]} config.enabledTypes - Question types to include (default: compare, addSameDenominator, simplify)
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

        // Question types to generate (future-proof: includes disabled types)
        this.enabledTypes = config.enabledTypes || ['compare', 'addSameDenominator', 'simplify'];

        this.difficultyConfig = {
            'קל': {
                maxNumerator: 4,
                denominators: [2, 4]
            },
            'בינוני': {
                maxNumerator: 8,
                denominators: [2, 3, 4, 5, 6]
            },
            'קשה': {
                maxNumerator: 12,
                denominators: [2, 3, 4, 5, 6, 8, 10, 12]
            }
        };

        this.hebrewText = {
            encouragements: {
                correct: ['מעולה!', 'פנטסטי!', 'את גאונית!', 'כל הכבוד!', 'מושלם!', 'יופי!'],
                wrong: ['לא נורא!', 'ננסה שוב!', 'כמעט!', 'אפשר ללמוד מטעויות!', 'בפעם הבאה!']
            },
            correctVoice: 'כל הכבוד אמה!',
            wrongTip: 'טיפ: תרגלי צמצום שברים!'
        };

        // LTR embedding characters for proper RTL display
        this.LTR_START = '\u202A';
        this.LTR_END = '\u202C';
    }

    /**
     * Generate a new fraction question
     * @param {string} level - Difficulty level ('קל', 'בינוני', 'קשה')
     * @returns {Object} View Object for rendering
     */
    generateQuestion(level = this.currentLevel) {
        const type = this.enabledTypes[Math.floor(Math.random() * this.enabledTypes.length)];
        const range = this.difficultyConfig[level];

        switch (type) {
            case 'compare':
                return this._generateCompare(range);
            case 'addSameDenominator':
                return this._generateAddSameDenominator(range);
            case 'simplify':
                return this._generateSimplify(range);
            case 'fractionToDecimal':
                return this._generateFractionToDecimal();
            case 'decimalToFraction':
                return this._generateDecimalToFraction();
            default:
                throw new Error(`Unknown question type: ${type}`);
        }
    }

    /**
     * Check user answer and return feedback
     * @param {string|number} userAnswer - User's answer
     * @param {string|number} correctAnswer - Correct answer
     * @param {Object} currentQuestion - Current question object (for context)
     * @returns {Object} View Object for feedback rendering
     */
    checkAnswer(userAnswer, correctAnswer, currentQuestion) {
        if (!userAnswer) {
            return {
                type: 'validation-error',
                message: 'אנא הכניסי תשובה!'
            };
        }

        let isCorrect = false;

        // Handle numeric answers
        if (typeof correctAnswer === 'number') {
            isCorrect = parseFloat(userAnswer) === correctAnswer;
        } else {
            // Handle string answers (fractions like "3/4")
            const userClean = userAnswer.toString().replace(/\s/g, '');
            const correctClean = correctAnswer.toString().replace(/\s/g, '');
            isCorrect = userClean === correctClean;
        }

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
            module: 'fraction',
            isCorrect: isCorrect,
            feedbackType: isCorrect ? 'correct' : 'wrong',
            feedbackMessage: isCorrect
                ? `✅ ${encouragement} תשובה נכונה!`
                : `❌ ${encouragement}`,
            voiceMessage: isCorrect ? this.hebrewText.correctVoice : null,
            correctAnswerDisplay: isCorrect ? null : `התשובה הנכונה: ${correctAnswer}`,
            tipMessage: isCorrect ? null : this.hebrewText.wrongTip,
            statistics: { ...this.statistics },
            difficultyChange: difficultyChange, // { changed: true, newLevel: 'בינוני', direction: 'up' } or null
            autoAdvance: isCorrect, // If true, UI should auto-advance after delay
            celebrationTrigger: this.statistics.totalQuestions % 10 === 0,
            showNewQuestionButton: !isCorrect
        };
    }

    // ========================================
    // PRIVATE METHODS - Question Generators
    // ========================================

    /**
     * Generate a "compare fractions" question (same denominator)
     * @private
     */
    _generateCompare(range) {
        const den = range.denominators[Math.floor(Math.random() * range.denominators.length)];
        const num1 = Math.floor(Math.random() * den) + 1;
        const num2 = Math.floor(Math.random() * den) + 1;

        // Determine correct answer
        let correctAnswer;
        if (num1 > num2) correctAnswer = '>';
        else if (num1 < num2) correctAnswer = '<';
        else correctAnswer = '=';

        const leftFraction = `${num1}/${den}`;
        const rightFraction = `${num2}/${den}`;

        return {
            type: 'question',
            module: 'fraction',
            questionText: 'מה הסימן הנכון?',
            equation: `${leftFraction} ___ ${rightFraction}`,
            questionType: 'choice',
            choices: [
                { id: 0, text: '>', value: '>', ltr: true },
                { id: 1, text: '<', value: '<', ltr: true },
                { id: 2, text: '=', value: '=', ltr: true }
            ],
            correctAnswer: correctAnswer,
            metadata: {
                leftFraction,
                rightFraction,
                num1,
                num2,
                den,
                questionType: 'compare'
            }
        };
    }

    /**
     * Generate "add fractions with same denominator" question
     * @private
     */
    _generateAddSameDenominator(range) {
        const den = range.denominators[Math.floor(Math.random() * range.denominators.length)];
        const n1 = Math.floor(Math.random() * (den - 1)) + 1;
        const n2 = Math.floor(Math.random() * (den - n1)) + 1;
        const sum = n1 + n2;
        const simplified = this._simplifyFraction(sum, den);

        let equation, correctAnswer, questionText;

        if (simplified.den === 1) {
            // Result is a whole number
            correctAnswer = simplified.num;
            equation = `${n1}/${den} + ${n2}/${den} = ___`;
            questionText = 'חשבי:';
        } else if (simplified.num === sum && simplified.den === den) {
            // Result doesn't need simplification - ask for just numerator
            correctAnswer = sum;
            equation = `${n1}/${den} + ${n2}/${den} = ___/${den}`;
            questionText = 'חשבי:';
        } else {
            // Result needs simplification
            correctAnswer = `${simplified.num}/${simplified.den}`;
            equation = `${n1}/${den} + ${n2}/${den} = ___`;
            questionText = 'חשבי וצמצמי:';
        }

        return {
            type: 'question',
            module: 'fraction',
            questionText: questionText,
            equation: equation,
            questionType: 'input',
            inputPlaceholder: 'הכניסי תשובה',
            correctAnswer: correctAnswer,
            metadata: {
                n1,
                n2,
                den,
                sum,
                simplified,
                questionType: 'addSameDenominator'
            }
        };
    }

    /**
     * Generate "simplify fraction" question
     * @private
     */
    _generateSimplify(range) {
        const baseDen = range.denominators[Math.floor(Math.random() * range.denominators.length)];
        const multiplier = Math.floor(Math.random() * 3) + 2; // 2-4
        const numToSimplify = (Math.floor(Math.random() * (baseDen - 1)) + 1) * multiplier;
        const denToSimplify = baseDen * multiplier;

        const result = this._simplifyFraction(numToSimplify, denToSimplify);
        const correctAnswer = `${result.num}/${result.den}`;

        return {
            type: 'question',
            module: 'fraction',
            questionText: 'צמצמי:',
            equation: `${numToSimplify}/${denToSimplify} = ___`,
            questionType: 'input',
            inputPlaceholder: 'הכניסי תשובה',
            correctAnswer: correctAnswer,
            metadata: {
                numToSimplify,
                denToSimplify,
                result,
                questionType: 'simplify'
            }
        };
    }

    /**
     * Generate "fraction to decimal" question (for future use)
     * @private
     */
    _generateFractionToDecimal() {
        const fractionPairs = [
            { num: 1, den: 2, decimal: 0.5 },
            { num: 1, den: 4, decimal: 0.25 },
            { num: 3, den: 4, decimal: 0.75 },
            { num: 1, den: 5, decimal: 0.2 },
            { num: 2, den: 5, decimal: 0.4 },
            { num: 3, den: 5, decimal: 0.6 },
            { num: 4, den: 5, decimal: 0.8 },
            { num: 1, den: 10, decimal: 0.1 },
            { num: 3, den: 10, decimal: 0.3 }
        ];

        const pair = fractionPairs[Math.floor(Math.random() * fractionPairs.length)];
        const equationLTR = `${this.LTR_START}${pair.num}/${pair.den} = ___${this.LTR_END}`;

        return {
            type: 'question',
            module: 'fraction',
            questionText: `כתבי כעשרוני: ${equationLTR}`,
            questionType: 'input',
            inputPlaceholder: 'הכניסי תשובה',
            correctAnswer: pair.decimal,
            metadata: {
                fraction: `${pair.num}/${pair.den}`,
                decimal: pair.decimal,
                questionType: 'fractionToDecimal'
            }
        };
    }

    /**
     * Generate "decimal to fraction" question (for future use)
     * @private
     */
    _generateDecimalToFraction() {
        const decimalOptions = [
            { decimal: 0.5, num: 1, den: 2 },
            { decimal: 0.25, num: 1, den: 4 },
            { decimal: 0.75, num: 3, den: 4 },
            { decimal: 0.2, num: 1, den: 5 },
            { decimal: 0.4, num: 2, den: 5 }
        ];

        const pair = decimalOptions[Math.floor(Math.random() * decimalOptions.length)];
        const equationLTR = `${this.LTR_START}${pair.decimal} = ___${this.LTR_END}`;
        const correctAnswer = `${pair.num}/${pair.den}`;

        return {
            type: 'question',
            module: 'fraction',
            questionText: `כתבי כשבר: ${equationLTR}`,
            questionType: 'input',
            inputPlaceholder: 'הכניסי תשובה',
            correctAnswer: correctAnswer,
            metadata: {
                decimal: pair.decimal,
                fraction: correctAnswer,
                questionType: 'decimalToFraction'
            }
        };
    }

    // ========================================
    // PRIVATE METHODS - Utilities
    // ========================================

    /**
     * Greatest Common Divisor (Euclidean algorithm)
     * @private
     */
    _gcd(a, b) {
        return b === 0 ? a : this._gcd(b, a % b);
    }

    /**
     * Simplify a fraction to lowest terms
     * @private
     */
    _simplifyFraction(num, den) {
        const divisor = this._gcd(num, den);
        return {
            num: num / divisor,
            den: den / divisor
        };
    }

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
    module.exports = FractionModule;
}

// Export for ES6
if (typeof exports !== 'undefined') {
    exports.FractionModule = FractionModule;
}
