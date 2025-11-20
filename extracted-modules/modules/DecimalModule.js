/**
 * Decimal Module (Headless)
 *
 * Pure JavaScript class for decimal number practice.
 * Zero DOM dependencies - returns JSON View Objects.
 *
 * Extracted from: src/math/Emma_math_lab.html (lines 2116-2500)
 * Date: 2025-11-20
 *
 * Question Types:
 * - decomposition: Break number into place values (e.g., 435 = 400 + 30 + ?)
 * - digitValue: Find value of a digit (e.g., What is value of 5 in 4,521?)
 * - nextPrevious: Find next or previous number
 * - compare: Compare two numbers (<, =, >)
 * - missingDigit: Find missing digit in pattern (e.g., 4_21 between 4000-4500)
 */

class DecimalModule {
    /**
     * Initialize decimal module
     * @param {object} config - Configuration options
     * @param {string} config.initialLevel - Starting difficulty ('קל' | 'בינוני' | 'קשה')
     * @param {object} config.statistics - Existing statistics
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

        // Difficulty configuration
        this.difficultyConfig = {
            'קל': { min: 10, max: 99, digits: 2 },      // 10-99 (two-digit)
            'בינוני': { min: 100, max: 999, digits: 3 }, // 100-999 (three-digit)
            'קשה': { min: 1000, max: 9999, digits: 4 }   // 1,000-9,999 (four-digit)
        };

        this.questionTypes = ['decomposition', 'digitValue', 'nextPrevious', 'compare', 'missingDigit'];

        this.hebrewText = {
            encouragements: {
                correct: ['מעולה!', 'פנטסטי!', 'את גאונית!', 'כל הכבוד!', 'מושלם!', 'יופי!'],
                wrong: ['לא נורא!', 'ננסה שוב!', 'כמעט!', 'אפשר ללמוד מטעויות!', 'בפעם הבאה!']
            }
        };
    }

    /**
     * Generate a new decimal question
     * @param {string} level - Difficulty level
     * @returns {object} View Object with question data
     */
    generateQuestion(level = this.currentLevel) {
        const type = this.questionTypes[Math.floor(Math.random() * this.questionTypes.length)];
        const range = this.difficultyConfig[level];

        let questionData;
        switch (type) {
            case 'decomposition':
                questionData = this._generateDecomposition(range);
                break;
            case 'digitValue':
                questionData = this._generateDigitValue(range);
                break;
            case 'nextPrevious':
                questionData = this._generateNextPrevious(range);
                break;
            case 'compare':
                questionData = this._generateCompare(range);
                break;
            case 'missingDigit':
                questionData = this._generateMissingDigit(range);
                break;
        }

        return {
            type: 'question',
            module: 'decimal',
            timestamp: Date.now(),
            difficulty: level,

            questionText: questionData.questionText,
            questionType: questionData.questionType, // 'input' or 'choice'

            // For input questions
            inputValue: questionData.questionType === 'input' ? '' : undefined,
            inputPlaceholder: questionData.questionType === 'input' ? 'הכניסי תשובה' : undefined,
            showInput: questionData.questionType === 'input',

            // For choice questions
            choices: questionData.choices || undefined,
            selectedChoice: questionData.questionType === 'choice' ? null : undefined,
            showChoices: questionData.questionType === 'choice',

            correctAnswer: questionData.correctAnswer,
            metadata: questionData.metadata || {},

            showCheckButton: true,
            showNextButton: false,
            focus: true
        };
    }

    /**
     * Validate user answer
     * @param {string|number} userAnswer - User's answer
     * @param {string|number|object} correctAnswer - Expected answer (can be range object)
     * @returns {object} View Object with feedback data
     */
    checkAnswer(userAnswer, correctAnswer) {
        let isCorrect = false;

        // Handle range-based answers (for missingDigit type)
        if (correctAnswer && correctAnswer.type === 'range') {
            const userNum = parseFloat(userAnswer);
            isCorrect = userNum >= correctAnswer.min && userNum <= correctAnswer.max;
            // Also verify digit pattern matches
            const userStr = userNum.toString();
            if (isCorrect && correctAnswer.pattern) {
                const expectedPattern = correctAnswer.pattern;
                const missingPos = correctAnswer.missingPos;
                // Check if all other digits match
                for (let i = 0; i < expectedPattern.length; i++) {
                    if (i !== missingPos && userStr[i] !== expectedPattern[i]) {
                        isCorrect = false;
                        break;
                    }
                }
            }
        } else {
            // Standard comparison
            if (typeof correctAnswer === 'number') {
                isCorrect = parseFloat(userAnswer) === correctAnswer;
            } else {
                isCorrect = userAnswer.toString().trim() === correctAnswer.toString().trim();
            }
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

        const difficultyChange = this._checkDifficultyAdjustment();

        // Format correct answer for display
        let correctAnswerDisplay;
        if (correctAnswer && correctAnswer.type === 'range') {
            correctAnswerDisplay = `בין ${this._formatNumber(correctAnswer.min)} ל-${this._formatNumber(correctAnswer.max)}`;
        } else {
            correctAnswerDisplay = this._formatNumber(correctAnswer);
        }

        return {
            type: 'feedback',
            module: 'decimal',
            timestamp: Date.now(),

            isCorrect: isCorrect,
            userAnswer: userAnswer,
            correctAnswer: correctAnswerDisplay,

            feedbackType: isCorrect ? 'correct' : 'wrong',
            feedbackMessage: this._getFeedbackMessage(isCorrect),
            encouragement: this._getRandomEncouragement(isCorrect),
            feedbackIcon: isCorrect ? '✅' : '❌',

            explanation: isCorrect ? null : `התשובה הנכונה: ${correctAnswerDisplay}`,
            showExplanation: !isCorrect,

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

            difficultyChange: difficultyChange,
            newDifficulty: this.currentLevel,

            autoAdvance: isCorrect,
            autoAdvanceDelay: 1500,
            showCelebration: this.statistics.totalQuestions % 10 === 0
        };
    }

    // ========================================================================
    // PRIVATE METHODS - Question Generators
    // ========================================================================

    _generateDecomposition(range) {
        const num = this._getRandomNumber(range);
        const digits = num.toString().split('').map(Number);
        const position = Math.floor(Math.random() * digits.length);
        const placeValues = [];
        let answer;

        for (let i = 0; i < digits.length; i++) {
            const placeValue = digits[i] * Math.pow(10, digits.length - 1 - i);
            if (i === position) {
                placeValues.push('?');
                answer = placeValue;
            } else {
                placeValues.push(this._formatNumber(placeValue));
            }
        }

        return {
            questionText: `${this._formatNumber(num)} = ${placeValues.join(' + ')}`,
            questionType: 'input',
            correctAnswer: answer,
            metadata: {
                questionType: 'decomposition',
                number: num,
                position: position
            }
        };
    }

    _generateDigitValue(range) {
        const num = this._generateDistinctDigitNumber(range.digits);
        const digitStr = num.toString();
        const digitPos = Math.floor(Math.random() * digitStr.length);
        const digit = parseInt(digitStr[digitPos]);
        const value = digit * Math.pow(10, digitStr.length - 1 - digitPos);

        return {
            questionText: `מה ערך הספרה ${digit} במספר ${this._formatNumber(num)}?`,
            questionType: 'input',
            correctAnswer: value,
            metadata: {
                questionType: 'digitValue',
                number: num,
                digit: digit,
                position: digitPos
            }
        };
    }

    _generateNextPrevious(range) {
        const num = this._getRandomNumber(range);
        const isNext = Math.random() < 0.5;

        return {
            questionText: isNext
                ? `מהו המספר העוקב של ${this._formatNumber(num)}?`
                : `מהו המספר הקודם של ${this._formatNumber(num)}?`,
            questionType: 'input',
            correctAnswer: isNext ? num + 1 : num - 1,
            metadata: {
                questionType: 'nextPrevious',
                number: num,
                direction: isNext ? 'next' : 'previous'
            }
        };
    }

    _generateCompare(range) {
        const num1 = this._getRandomNumber(range);
        const num2 = this._getRandomNumber(range);

        let correctSymbol;
        if (num1 < num2) correctSymbol = '<';
        else if (num1 > num2) correctSymbol = '>';
        else correctSymbol = '=';

        return {
            questionText: `${this._formatNumber(num1)} ___ ${this._formatNumber(num2)}`,
            questionType: 'choice',
            choices: ['<', '=', '>'],
            correctAnswer: correctSymbol,
            metadata: {
                questionType: 'compare',
                num1: num1,
                num2: num2
            }
        };
    }

    _generateMissingDigit(range) {
        const num = this._getRandomNumber(range);
        const numStr = num.toString();
        const numDigits = numStr.length;
        const missingPos = Math.floor(Math.random() * numStr.length);
        const missingDigit = numStr[missingPos];
        const numWithMissing = numStr.substring(0, missingPos) + '_' + numStr.substring(missingPos + 1);

        // Calculate place value and generate bounds
        const placeValue = Math.pow(10, numDigits - 1 - missingPos);
        let offset;

        if (placeValue === 1) offset = Math.floor(Math.random() * 10) + 1;
        else if (placeValue === 10) offset = Math.floor(Math.random() * 41) + 10;
        else if (placeValue === 100) offset = Math.floor(Math.random() * 301) + 100;
        else offset = Math.floor(Math.random() * 2001) + 1000;

        let lowerBound = Math.max(num - offset, Math.pow(10, numDigits - 1));
        let upperBound = Math.min(num + offset, Math.pow(10, numDigits) - 1);

        // Force LTR direction for number pattern
        const ltrNumPattern = '\u202A' + numWithMissing + '\u202C';

        return {
            questionText: `מהי הספרה החסרה? ${ltrNumPattern}\n(המספר נמצא בין ${this._formatNumber(lowerBound)} ל-${this._formatNumber(upperBound)})`,
            questionType: 'input',
            correctAnswer: {
                type: 'range',
                min: lowerBound,
                max: upperBound,
                pattern: numStr,
                missingPos: missingPos,
                originalDigit: parseInt(missingDigit)
            },
            metadata: {
                questionType: 'missingDigit',
                number: num,
                missingPos: missingPos,
                pattern: numStr
            }
        };
    }

    // ========================================================================
    // PRIVATE METHODS - Utilities
    // ========================================================================

    _getRandomNumber(range) {
        return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
    }

    _generateDistinctDigitNumber(targetDigits) {
        const availableDigits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        const selectedDigits = [];

        // First digit cannot be 0
        const firstDigitPool = availableDigits.filter(d => d !== 0);
        const firstDigit = firstDigitPool[Math.floor(Math.random() * firstDigitPool.length)];
        selectedDigits.push(firstDigit);

        // Remove first digit from pool
        const remainingDigits = availableDigits.filter(d => d !== firstDigit);

        // Select remaining digits randomly
        for (let i = 1; i < targetDigits; i++) {
            const randomIndex = Math.floor(Math.random() * remainingDigits.length);
            selectedDigits.push(remainingDigits[randomIndex]);
            remainingDigits.splice(randomIndex, 1);
        }

        return parseInt(selectedDigits.join(''));
    }

    _formatNumber(num) {
        if (typeof num === 'number') {
            return num.toLocaleString('en-US');
        }
        return num;
    }

    _getFeedbackMessage(isCorrect) {
        const encouragement = this._getRandomEncouragement(isCorrect);
        return isCorrect ? `${encouragement} תשובה נכונה!` : `${encouragement}`;
    }

    _getRandomEncouragement(isCorrect) {
        const pool = this.hebrewText.encouragements[isCorrect ? 'correct' : 'wrong'];
        return pool[Math.floor(Math.random() * pool.length)];
    }

    _checkDifficultyAdjustment() {
        if (this.statistics.consecutiveCorrect >= 3 && this.currentLevel !== 'קשה') {
            if (this.currentLevel === 'קל') {
                this.currentLevel = 'בינוני';
            } else if (this.currentLevel === 'בינוני') {
                this.currentLevel = 'קשה';
            }
            this.statistics.consecutiveCorrect = 0;
            return 'level_up';
        }

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

    getStatistics() {
        return { ...this.statistics };
    }

    getCurrentLevel() {
        return this.currentLevel;
    }

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

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DecimalModule;
}

if (typeof exports !== 'undefined') {
    exports.DecimalModule = DecimalModule;
}
