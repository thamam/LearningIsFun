/**
 * DistributiveModule - Headless Distributive Property Practice
 *
 * Extracted from: src/math/js/modules/distributive_module.js
 * Zero DOM dependencies - Returns View Objects for rendering
 *
 * Pedagogical Philosophy (from the pedagogical triad):
 * This is the BRIDGE module - connecting place value to multiplication.
 * The distributive property is not a trick, but the fundamental principle
 * that enables all multi-digit multiplication.
 *
 * Example: 7 × 13 = 7 × (10 + 3) = (7 × 10) + (7 × 3) = 70 + 21 = 91
 *
 * Question Types:
 * - fill_blank: Fill missing number in decomposition
 * - calculate: Calculate final answer using distributive property
 * - subtraction_decomposition: Use (a × (b - c)) for near-round numbers
 * - three_digit: Connect to standard vertical algorithm
 *
 * All questions include detailed pedagogical explanations.
 *
 * @version 1.0.0
 */

class DistributiveModule {
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

        this.hebrewText = {
            encouragements: {
                correct: ['מעולה!', 'פנטסטי!', 'את גאונית!', 'כל הכבוד!', 'מושלם!'],
                wrong: ['לא נורא!', 'ננסה שוב!', 'כמעט!', 'אפשר ללמוד מטעויות!']
            }
        };
    }

    /**
     * Generate a new distributive property question
     * @param {string} level - Difficulty level ('קל', 'בינוני', 'קשה')
     * @returns {Object} View Object for rendering
     */
    generateQuestion(level = this.currentLevel) {
        if (level === 'קל') {
            return this._generateEasyQuestion();
        } else if (level === 'בינוני') {
            return this._generateMediumQuestion();
        } else {
            return this._generateHardQuestion();
        }
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

        // Include explanation (always shown for both correct and wrong)
        const explanation = currentQuestion.explanation || null;

        return {
            type: 'feedback',
            module: 'distributive',
            isCorrect: isCorrect,
            feedbackType: isCorrect ? 'correct' : 'wrong',
            feedbackMessage: isCorrect
                ? `✅ ${encouragement} תשובה נכונה!`
                : `❌ ${encouragement}`,
            correctAnswerDisplay: isCorrect ? null : `התשובה הנכונה: ${this._formatNumber(correctAnswer)}`,
            explanation: explanation,
            statistics: { ...this.statistics },
            difficultyChange: difficultyChange,
            autoAdvance: isCorrect,
            autoAdvanceDelay: 2500, // Longer delay to read explanation
            celebrationTrigger: this.statistics.totalQuestions % 10 === 0,
            showNewQuestionButton: !isCorrect
        };
    }

    // ========================================
    // PRIVATE METHODS - Question Generators
    // ========================================

    /**
     * Generate easy-level question (קל)
     * @private
     */
    _generateEasyQuestion() {
        const a = Math.floor(Math.random() * 7) + 3; // 3-9
        const tens = (Math.floor(Math.random() * 3) + 1) * 10; // 10, 20, or 30
        const ones = Math.floor(Math.random() * 8) + 2; // 2-9
        const b = tens + ones; // 12-39

        const types = ['fill_blank', 'calculate'];
        const type = types[Math.floor(Math.random() * types.length)];

        if (type === 'fill_blank') {
            return this._generateFillBlank(a, b, tens, ones);
        } else {
            return this._generateCalculate(a, b, tens, ones);
        }
    }

    /**
     * Fill in the blank question
     * @private
     */
    _generateFillBlank(a, b, tens, ones) {
        const missingPart = Math.random() < 0.5 ? 'ones' : 'tens';

        if (missingPart === 'ones') {
            return {
                type: 'question',
                module: 'distributive',
                questionText: `${a} × ${b} = ${a} × (${tens} + ${ones})\n= (${a} × ${tens}) + (${a} × ___)\n\nמהו המספר החסר?`,
                questionType: 'input',
                inputPlaceholder: 'הכניסי תשובה',
                correctAnswer: ones,
                explanation: `התשובה: ${ones}\n\nהסבר: אנחנו מפרקים את ${b} ל-${tens} + ${ones}, ואז מכפילים כל חלק ב-${a}.\nאז צריך: (${a} × ${tens}) + (${a} × ${ones}) = ${a * tens} + ${a * ones} = ${a * b}`,
                areaModel: {
                    factor1: a,
                    factor2: b,
                    decomposition: { tens, ones }
                },
                metadata: {
                    questionType: 'fill_blank',
                    missingPart: 'ones'
                }
            };
        } else {
            return {
                type: 'question',
                module: 'distributive',
                questionText: `${a} × ${b} = ${a} × (${tens} + ${ones})\n= (${a} × ___) + (${a} × ${ones})\n\nמהו המספר החסר?`,
                questionType: 'input',
                inputPlaceholder: 'הכניסי תשובה',
                correctAnswer: tens,
                explanation: `התשובה: ${tens}\n\nהסבר: אנחנו מפרקים את ${b} ל-${tens} + ${ones}, ואז מכפילים כל חלק ב-${a}.\nאז צריך: (${a} × ${tens}) + (${a} × ${ones}) = ${a * tens} + ${a * ones} = ${a * b}`,
                areaModel: {
                    factor1: a,
                    factor2: b,
                    decomposition: { tens, ones }
                },
                metadata: {
                    questionType: 'fill_blank',
                    missingPart: 'tens'
                }
            };
        }
    }

    /**
     * Calculate final answer using distributive property
     * @private
     */
    _generateCalculate(a, b, tens, ones) {
        const answer = a * b;

        return {
            type: 'question',
            module: 'distributive',
            questionText: `חשב בעזרת חוק הפילוג:\n\n${a} × ${b} = ${a} × (${tens} + ${ones})\n= (${a} × ${tens}) + (${a} × ${ones})\n= ___ + ___\n= ?`,
            questionType: 'input',
            inputPlaceholder: 'הכניסי תשובה',
            correctAnswer: answer,
            explanation: `פתרון:\n1) ${a} × ${tens} = ${a * tens}\n2) ${a} × ${ones} = ${a * ones}\n3) ${a * tens} + ${a * ones} = ${answer}`,
            areaModel: {
                factor1: a,
                factor2: b,
                decomposition: { tens, ones }
            },
            metadata: {
                questionType: 'calculate'
            }
        };
    }

    /**
     * Generate medium-level question (בינוני)
     * @private
     */
    _generateMediumQuestion() {
        const a = Math.floor(Math.random() * 8) + 3; // 3-10
        const base = (Math.floor(Math.random() * 9) + 2) * 10; // 20, 30, ..., 100
        const offset = Math.floor(Math.random() * 8) + 1; // 1-8

        const useSubtraction = Math.random() < 0.5;

        if (useSubtraction) {
            return this._generateSubtractionDecomposition(a, base, offset);
        } else {
            return this._generateAdditionDecomposition(a, base, offset);
        }
    }

    /**
     * Subtraction decomposition: 7 × 19 = 7 × (20 - 1)
     * @private
     */
    _generateSubtractionDecomposition(a, base, offset) {
        const b = base - offset;
        const answer = a * b;

        return {
            type: 'question',
            module: 'distributive',
            questionText: `חשב בעזרת חוק הפילוג:\n\n${a} × ${b}\n\nרמז: ${b} = ${base} - ${offset}`,
            questionType: 'input',
            inputPlaceholder: 'הכניסי תשובה',
            correctAnswer: answer,
            explanation: `פתרון:\n${a} × ${b} = ${a} × (${base} - ${offset})\n= (${a} × ${base}) - (${a} × ${offset})\n= ${a * base} - ${a * offset}\n= ${answer}\n\n💡 שימוש בחיסור עוזר כשהמספר קרוב לעשרת עגולה!`,
            areaModel: {
                factor1: a,
                factor2: b,
                decomposition: { base, offset, operation: 'subtraction' }
            },
            metadata: {
                questionType: 'subtraction_decomposition',
                base,
                offset
            }
        };
    }

    /**
     * Addition decomposition with larger numbers: 8 × 47 = 8 × (40 + 7)
     * @private
     */
    _generateAdditionDecomposition(a, base, offset) {
        const b = base + offset;
        const tens = Math.floor(b / 10) * 10;
        const ones = b % 10;
        const answer = a * b;

        return {
            type: 'question',
            module: 'distributive',
            questionText: `חשב בעזרת חוק הפילוג:\n\n${a} × ${b}\n\nרמז: ${b} = ${tens} + ${ones}`,
            questionType: 'input',
            inputPlaceholder: 'הכניסי תשובה',
            correctAnswer: answer,
            explanation: `פתרון:\n${a} × ${b} = ${a} × (${tens} + ${ones})\n= (${a} × ${tens}) + (${a} × ${ones})\n= ${a * tens} + ${a * ones}\n= ${answer}`,
            areaModel: {
                factor1: a,
                factor2: b,
                decomposition: { tens, ones }
            },
            metadata: {
                questionType: 'addition_decomposition',
                tens,
                ones
            }
        };
    }

    /**
     * Generate hard-level question (קשה) - Three-digit multiplication
     * @private
     */
    _generateHardQuestion() {
        const a = Math.floor(Math.random() * 6) + 4; // 4-9
        const hundreds = (Math.floor(Math.random() * 3) + 1) * 100; // 100, 200, 300
        const tens = Math.floor(Math.random() * 10) * 10; // 0-90
        const ones = Math.floor(Math.random() * 10); // 0-9
        const b = hundreds + tens + ones; // 100-399

        const answer = a * b;

        const h = Math.floor(b / 100) * 100;
        const t = Math.floor((b % 100) / 10) * 10;
        const o = b % 10;

        // Build decomposition string
        const parts = [];
        const calculation = [];
        const sumParts = [];

        if (h > 0) {
            parts.push(`(${a} × ${h})`);
            calculation.push(`${a} × ${h} = ${a * h}`);
            sumParts.push(`${a * h}`);
        }
        if (t > 0) {
            parts.push(`(${a} × ${t})`);
            calculation.push(`${a} × ${t} = ${a * t}`);
            sumParts.push(`${a * t}`);
        }
        if (o > 0) {
            parts.push(`(${a} × ${o})`);
            calculation.push(`${a} × ${o} = ${a * o}`);
            sumParts.push(`${a * o}`);
        }

        const decomposition = parts.join(' + ');

        // Build decomposition display
        const decompParts = [];
        if (h > 0) decompParts.push(`${h}`);
        if (t > 0) decompParts.push(`${t}`);
        if (o > 0) decompParts.push(`${o}`);

        return {
            type: 'question',
            module: 'distributive',
            questionText: `חשב בעזרת חוק הפילוג:\n\n${a} × ${this._formatNumber(b)}`,
            questionType: 'input',
            inputPlaceholder: 'הכניסי תשובה',
            correctAnswer: answer,
            explanation: `פתרון מלא:\n\n1) פירוק עשרוני: ${this._formatNumber(b)} = ${decompParts.join(' + ')}\n\n2) חוק הפילוג:\n${a} × ${this._formatNumber(b)} = ${decomposition}\n\n3) חישוב:\n${calculation.join('\n')}\n\n4) חיבור:\n${sumParts.join(' + ')} = ${this._formatNumber(answer)}\n\n💡 זה בדיוק מה שקורה באלגוריתם הכפל המאונך!`,
            connectionToAlgorithm: true, // Flag for UI to highlight pedagogy
            areaModel: {
                factor1: a,
                factor2: b,
                decomposition: { hundreds: h, tens: t, ones: o }
            },
            metadata: {
                questionType: 'three_digit',
                hundreds: h,
                tens: t,
                ones: o
            }
        };
    }

    // ========================================
    // PRIVATE METHODS - Utilities
    // ========================================

    /**
     * Format large numbers with thousands separator
     * @private
     */
    _formatNumber(num) {
        return num.toLocaleString('en-US');
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
    module.exports = DistributiveModule;
}

// Export for ES6
if (typeof exports !== 'undefined') {
    exports.DistributiveModule = DistributiveModule;
}
