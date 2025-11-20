/**
 * NumberLineModule - Headless Number Line Practice
 *
 * Extracted from: src/math/Emma_math_lab.html (lines 3042-3398)
 * Zero DOM dependencies - Returns View Objects with visual rendering data
 *
 * Question Types:
 * - whatIsNumber: Arrow points to position, identify the number (visual-input)
 * - betweenNumbers: Calculate midpoint between two numbers (input, no visual)
 * - closerTo: Which reference number is closer? (choice, no visual)
 *
 * Visual Rendering:
 * For visual questions, the View Object includes complete data for
 * rendering the number line: markers, minor ticks, arrow position, zoom range.
 *
 * @version 1.0.0
 */

class NumberLineModule {
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

        this.difficultyConfig = {
            'קל': { min: 0, max: 100, interval: 10 },
            'בינוני': { min: 0, max: 500, interval: 50 },
            'קשה': { min: 0, max: 1000, interval: 100 }
        };

        this.questionTypes = ['whatIsNumber', 'betweenNumbers', 'closerTo'];

        this.hebrewText = {
            encouragements: {
                correct: ['מעולה!', 'פנטסטי!', 'את גאונית!', 'כל הכבוד!', 'מושלם!'],
                wrong: ['לא נורא!', 'ננסה שוב!', 'כמעט!', 'אפשר ללמוד מטעויות!', 'בפעם הבאה!']
            },
            correctVoice: 'כל הכבוד אמה!'
        };
    }

    /**
     * Generate a new number line question
     * @param {string} level - Difficulty level ('קל', 'בינוני', 'קשה')
     * @returns {Object} View Object for rendering
     */
    generateQuestion(level = this.currentLevel) {
        const range = this.difficultyConfig[level];
        const type = this.questionTypes[Math.floor(Math.random() * this.questionTypes.length)];

        switch (type) {
            case 'whatIsNumber':
                return this._generateWhatIsNumber(range);
            case 'betweenNumbers':
                return this._generateBetweenNumbers(range);
            case 'closerTo':
                return this._generateCloserTo(range);
            default:
                throw new Error(`Unknown question type: ${type}`);
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
        if (userAnswer === undefined || userAnswer === null || userAnswer === '') {
            return {
                type: 'validation-error',
                message: 'אנא הכניסי תשובה!'
            };
        }

        const userNum = parseFloat(userAnswer);

        if (isNaN(userNum)) {
            return {
                type: 'validation-error',
                message: 'אנא הכניסי מספר!'
            };
        }

        // Check if this question accepts approximate answers
        let isCorrect;
        if (currentQuestion.acceptableRange) {
            const range = currentQuestion.acceptableRange;
            isCorrect = (userNum >= range.min && userNum <= range.max);
        } else {
            isCorrect = userNum === correctAnswer;
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
            module: 'numberline',
            isCorrect: isCorrect,
            feedbackType: isCorrect ? 'correct' : 'wrong',
            feedbackMessage: isCorrect
                ? `✅ ${encouragement} תשובה נכונה!`
                : `❌ ${encouragement}`,
            voiceMessage: isCorrect ? this.hebrewText.correctVoice : null,
            correctAnswerDisplay: isCorrect ? null : `התשובה הנכונה: ${correctAnswer}`,
            statistics: { ...this.statistics },
            difficultyChange: difficultyChange,
            autoAdvance: isCorrect,
            autoAdvanceDelay: 1500,
            celebrationTrigger: this.statistics.totalQuestions % 10 === 0,
            showNewQuestionButton: !isCorrect
        };
    }

    // ========================================
    // PRIVATE METHODS - Question Generators
    // ========================================

    /**
     * "What number is marked by the arrow?" (visual question)
     * @private
     */
    _generateWhatIsNumber(range) {
        const useExactWithHint = Math.random() < 0.5;

        // Pick a random segment between two markers
        const numSegments = (range.max / range.interval) - 1;
        const segment = Math.floor(Math.random() * numSegments);
        const segmentStart = segment * range.interval;

        let arrowPosition;
        let questionText;
        let acceptableRange;

        if (useExactWithHint) {
            // Version 1: Exact answer with last digit hint
            const halfInterval = range.interval / 2;
            arrowPosition = segmentStart + halfInterval;
            const lastDigit = arrowPosition % 10;
            questionText = `איזה מספר מסומן בחץ? (מסתיים ב-${lastDigit})`;
            acceptableRange = null; // Exact answer required
        } else {
            // Version 2: Approximate answer with hint
            const possibleOffsets = [];
            for (let i = 1; i < range.interval / 5; i++) {
                possibleOffsets.push(i * 5); // Every 5 units
            }
            const offset = possibleOffsets[Math.floor(Math.random() * possibleOffsets.length)];
            arrowPosition = segmentStart + offset;

            // Determine hint
            let hint;
            if (arrowPosition % 10 === 0) {
                hint = 'מתחלק ב-10'; // Divisible by 10
            } else if (arrowPosition % 5 === 0) {
                hint = 'מסתיים ב-5'; // Ends with 5
            } else {
                const lastDigit = arrowPosition % 10;
                hint = `מסתיים ב-${lastDigit}`;
            }

            questionText = `איזה מספר מסומן בחץ? (${hint})`;

            // Accept within 25% of interval
            const tolerance = range.interval * 0.25;
            acceptableRange = {
                min: arrowPosition - tolerance,
                max: arrowPosition + tolerance
            };
        }

        // Generate visual rendering data
        const visualData = this._generateVisualData(range, arrowPosition);

        return {
            type: 'question',
            module: 'numberline',
            questionText: questionText,
            questionType: 'visual-input',
            inputPlaceholder: 'הכניסי מספר',
            correctAnswer: arrowPosition,
            acceptableRange: acceptableRange,
            visualData: visualData, // Complete data for rendering
            metadata: {
                questionType: 'whatIsNumber',
                arrowPosition,
                useExactWithHint
            }
        };
    }

    /**
     * "What number is exactly between X and Y?" (no visual)
     * @private
     */
    _generateBetweenNumbers(range) {
        const num1 = Math.floor(Math.random() * (range.max / range.interval / 2)) * range.interval;
        const num2 = num1 + range.interval * 2;
        const between = (num1 + num2) / 2;

        return {
            type: 'question',
            module: 'numberline',
            questionText: `איזה מספר נמצא בדיוק באמצע בין ${num1} ל-${num2}?`,
            questionType: 'input',
            inputPlaceholder: 'הכניסי תשובה',
            correctAnswer: between,
            visualData: null, // No visual for this question type
            metadata: {
                questionType: 'betweenNumbers',
                num1,
                num2
            }
        };
    }

    /**
     * "Is number X closer to A or B?" (choice, no visual)
     * @private
     */
    _generateCloserTo(range) {
        const baseNum = Math.floor(Math.random() * (range.max / range.interval)) * range.interval;
        const testNum = baseNum + Math.floor(range.interval * 0.3);
        const option1 = baseNum;
        const option2 = baseNum + range.interval;

        const answer = Math.abs(testNum - option1) < Math.abs(testNum - option2) ? option1 : option2;

        return {
            type: 'question',
            module: 'numberline',
            questionText: `המספר ${testNum} קרוב יותר ל-${option1} או ל-${option2}?`,
            questionType: 'choice',
            choices: [
                { id: 0, text: option1.toString(), value: option1 },
                { id: 1, text: option2.toString(), value: option2 }
            ],
            correctAnswer: answer,
            visualData: null, // No visual for this question type
            metadata: {
                questionType: 'closerTo',
                testNum,
                option1,
                option2
            }
        };
    }

    // ========================================
    // PRIVATE METHODS - Visual Data Generation
    // ========================================

    /**
     * Generate complete visual data for number line rendering
     * @private
     * @param {Object} range - {min, max, interval}
     * @param {number} arrowPosition - Position of arrow (or undefined)
     * @returns {Object} Complete visual data
     */
    _generateVisualData(range, arrowPosition) {
        // Calculate display range (zoom feature)
        let displayMin, displayMax;

        if (arrowPosition !== undefined) {
            // Zoom: show 3 segments centered on arrow
            const arrowSegment = Math.floor(arrowPosition / range.interval);
            const segmentsToShow = 3;
            const totalSegments = range.max / range.interval;

            let startSegment = Math.max(0, arrowSegment - 1);
            let endSegment = Math.min(totalSegments, startSegment + segmentsToShow);

            // Adjust if at the end
            if (endSegment === totalSegments) {
                startSegment = Math.max(0, endSegment - segmentsToShow);
            }

            displayMin = startSegment * range.interval;
            displayMax = endSegment * range.interval;
        } else {
            // No arrow, show full range
            displayMin = range.min;
            displayMax = range.max;
        }

        const displayRange = displayMax - displayMin;

        // Generate major markers (labeled)
        const majorMarkers = [];
        for (let value = displayMin; value <= displayMax; value += range.interval) {
            const position = ((value - displayMin) / displayRange) * 100;
            majorMarkers.push({
                value: value,
                position: position,
                label: value.toString()
            });
        }

        // Generate minor ticks (unlabeled, between major markers)
        const minorTicks = [];
        const minorTickInterval = range.interval / 5;
        for (let value = displayMin; value <= displayMax; value += minorTickInterval) {
            // Skip if this is a major marker position
            if (value % range.interval === 0) continue;

            const position = ((value - displayMin) / displayRange) * 100;
            minorTicks.push({
                value: value,
                position: position
            });
        }

        // Arrow data (if present)
        let arrow = null;
        if (arrowPosition !== undefined) {
            const arrowPos = ((arrowPosition - displayMin) / displayRange) * 100;
            arrow = {
                value: arrowPosition,
                position: arrowPos,
                symbol: '⬇️'
            };
        }

        return {
            range: {
                min: range.min,
                max: range.max,
                interval: range.interval
            },
            display: {
                min: displayMin,
                max: displayMax,
                range: displayRange
            },
            majorMarkers: majorMarkers,
            minorTicks: minorTicks,
            arrow: arrow
        };
    }

    // ========================================
    // PRIVATE METHODS - Utilities
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
    module.exports = NumberLineModule;
}

// Export for ES6
if (typeof exports !== 'undefined') {
    exports.NumberLineModule = NumberLineModule;
}
