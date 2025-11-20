/**
 * OrderOperationsModule - Headless Order of Operations Practice
 *
 * Extracted from: src/math/js/modules/order_operations_module.js
 * Zero DOM dependencies - Returns View Objects for rendering
 *
 * Pedagogical Philosophy:
 * Order of operations is not arbitrary rules to memorize, but the logical
 * "syntax" that emerges from solving real-world multi-step problems.
 *
 * Question Types:
 * - parens_first: (a + b) × c - demonstrates parentheses priority
 * - mult_before_add: a + b × c - demonstrates multiplication before addition
 * - three_ops: Multi-operation expressions
 * - word_problems: Real-world scenarios requiring order of operations
 *
 * All questions include step-by-step explanations.
 *
 * @version 1.0.0
 */

class OrderOperationsModule {
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
            },
            solutionLabel: 'פתרון:',
            explanationLabel: 'הסבר:'
        };

        // LTR embedding for mathematical expressions
        this.LTR_START = '\u202A';
        this.LTR_END = '\u202C';
    }

    /**
     * Generate a new order of operations question
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

        // Include step-by-step explanation (always shown for correct, always for wrong)
        const explanation = currentQuestion.explanation || null;

        return {
            type: 'feedback',
            module: 'order',
            isCorrect: isCorrect,
            feedbackType: isCorrect ? 'correct' : 'wrong',
            feedbackMessage: isCorrect
                ? `✅ ${encouragement} תשובה נכונה!`
                : `❌ ${encouragement}`,
            correctAnswerDisplay: isCorrect ? null : `התשובה הנכונה: ${correctAnswer}`,
            explanation: explanation,
            explanationLabel: isCorrect ? this.hebrewText.solutionLabel : this.hebrewText.explanationLabel,
            statistics: { ...this.statistics },
            difficultyChange: difficultyChange,
            autoAdvance: isCorrect,
            autoAdvanceDelay: 2000, // 2 seconds to read explanation
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
        const types = ['parens_first', 'mult_before_add'];
        const type = types[Math.floor(Math.random() * types.length)];

        if (type === 'parens_first') {
            return this._generateParensFirst();
        } else {
            return this._generateMultBeforeAdd();
        }
    }

    /**
     * Generate medium-level question (בינוני)
     * @private
     */
    _generateMediumQuestion() {
        const types = ['three_ops', 'subtract_divide', 'word_problem_simple'];
        const type = types[Math.floor(Math.random() * types.length)];

        if (type === 'three_ops') {
            return this._generateThreeOps();
        } else if (type === 'subtract_divide') {
            return this._generateSubtractDivide();
        } else {
            return this._generateWordProblemSimple();
        }
    }

    /**
     * Generate hard-level question (קשה)
     * @private
     */
    _generateHardQuestion() {
        const scenarios = [
            () => this._generateShoppingProblem(),
            () => this._generateAuditoriumProblem(),
            () => this._generateClassDivisionProblem()
        ];

        const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
        return scenario();
    }

    // ========================================
    // Easy Question Types
    // ========================================

    /**
     * Parentheses first: (a + b) × c or a × (b + c)
     * @private
     */
    _generateParensFirst() {
        const a = Math.floor(Math.random() * 8) + 2;
        const b = Math.floor(Math.random() * 8) + 2;
        const c = Math.floor(Math.random() * 5) + 2;

        if (Math.random() < 0.5) {
            // (a + b) × c
            const expr = `(${a} + ${b}) × ${c}`;
            const step1Result = a + b;
            const answer = step1Result * c;

            return {
                type: 'question',
                module: 'order',
                questionText: 'חשבי:',
                equation: `${expr} = ___`,
                questionType: 'input',
                inputPlaceholder: 'הכניסי תשובה',
                correctAnswer: answer,
                explanation: `קודם פותרים את הסוגריים: ${a} + ${b} = ${step1Result}, ואז: ${step1Result} × ${c} = ${answer}`,
                metadata: {
                    questionType: 'parens_first',
                    expression: expr,
                    step1: `${a} + ${b} = ${step1Result}`,
                    step2: `${step1Result} × ${c} = ${answer}`
                }
            };
        } else {
            // a × (b + c)
            const expr = `${a} × (${b} + ${c})`;
            const step1Result = b + c;
            const answer = a * step1Result;

            return {
                type: 'question',
                module: 'order',
                questionText: 'חשבי:',
                equation: `${expr} = ___`,
                questionType: 'input',
                inputPlaceholder: 'הכניסי תשובה',
                correctAnswer: answer,
                explanation: `קודם פותרים את הסוגריים: ${b} + ${c} = ${step1Result}, ואז: ${a} × ${step1Result} = ${answer}`,
                metadata: {
                    questionType: 'parens_first',
                    expression: expr,
                    step1: `${b} + ${c} = ${step1Result}`,
                    step2: `${a} × ${step1Result} = ${answer}`
                }
            };
        }
    }

    /**
     * Multiplication before addition: a + b × c
     * @private
     */
    _generateMultBeforeAdd() {
        const a = Math.floor(Math.random() * 20) + 5;
        const b = Math.floor(Math.random() * 8) + 2;
        const c = Math.floor(Math.random() * 8) + 2;

        const expr = `${a} + ${b} × ${c}`;
        const step1Result = b * c;
        const answer = a + step1Result;

        return {
            type: 'question',
            module: 'order',
            questionText: 'חשבי:',
            equation: `${expr} = ___`,
            questionType: 'input',
            inputPlaceholder: 'הכניסי תשובה',
            correctAnswer: answer,
            explanation: `קודם פותרים את הכפל: ${b} × ${c} = ${step1Result}, ואז: ${a} + ${step1Result} = ${answer}`,
            metadata: {
                questionType: 'mult_before_add',
                expression: expr,
                step1: `${b} × ${c} = ${step1Result}`,
                step2: `${a} + ${step1Result} = ${answer}`
            }
        };
    }

    // ========================================
    // Medium Question Types
    // ========================================

    /**
     * Three operations: (a + b) × c - d or a × b + c × d
     * @private
     */
    _generateThreeOps() {
        const a = Math.floor(Math.random() * 10) + 2;
        const b = Math.floor(Math.random() * 10) + 2;
        const c = Math.floor(Math.random() * 5) + 2;
        const d = Math.floor(Math.random() * 15) + 5;

        if (Math.random() < 0.5) {
            // (a + b) × c - d
            const expr = `(${a} + ${b}) × ${c} - ${d}`;
            const step1Result = a + b;
            const step2Result = step1Result * c;
            const answer = step2Result - d;

            return {
                type: 'question',
                module: 'order',
                questionText: 'חשבי:',
                equation: `${expr} = ___`,
                questionType: 'input',
                inputPlaceholder: 'הכניסי תשובה',
                correctAnswer: answer,
                explanation: `1) סוגריים: ${a} + ${b} = ${step1Result}\n2) כפל: ${step1Result} × ${c} = ${step2Result}\n3) חיסור: ${step2Result} - ${d} = ${answer}`,
                metadata: {
                    questionType: 'three_ops',
                    expression: expr,
                    step1: `${a} + ${b} = ${step1Result}`,
                    step2: `${step1Result} × ${c} = ${step2Result}`,
                    step3: `${step2Result} - ${d} = ${answer}`
                }
            };
        } else {
            // a × b + c × d
            const expr = `${a} × ${b} + ${c} × ${d}`;
            const mult1 = a * b;
            const mult2 = c * d;
            const answer = mult1 + mult2;

            return {
                type: 'question',
                module: 'order',
                questionText: 'חשבי:',
                equation: `${expr} = ___`,
                questionType: 'input',
                inputPlaceholder: 'הכניסי תשובה',
                correctAnswer: answer,
                explanation: `1) כפל ראשון: ${a} × ${b} = ${mult1}\n2) כפל שני: ${c} × ${d} = ${mult2}\n3) חיבור: ${mult1} + ${mult2} = ${answer}`,
                metadata: {
                    questionType: 'three_ops',
                    expression: expr,
                    step1: `${a} × ${b} = ${mult1}`,
                    step2: `${c} × ${d} = ${mult2}`,
                    step3: `${mult1} + ${mult2} = ${answer}`
                }
            };
        }
    }

    /**
     * Subtraction and division: (a - b) ÷ c (integer result)
     * @private
     */
    _generateSubtractDivide() {
        const c = Math.floor(Math.random() * 5) + 2; // divisor: 2-6
        const quotient = Math.floor(Math.random() * 10) + 3; // answer: 3-12
        const diff = c * quotient; // ensure diff is exactly divisible by c
        const b = Math.floor(Math.random() * 15) + 5; // subtrahend: 5-19
        const a = diff + b; // so that a - b = diff

        const expr = `(${a} - ${b}) ÷ ${c}`;

        return {
            type: 'question',
            module: 'order',
            questionText: 'חשבי:',
            equation: `${expr} = ___`,
            questionType: 'input',
            inputPlaceholder: 'הכניסי תשובה',
            correctAnswer: quotient,
            explanation: `1) סוגריים: ${a} - ${b} = ${diff}\n2) חילוק: ${diff} ÷ ${c} = ${quotient}`,
            metadata: {
                questionType: 'subtract_divide',
                expression: expr,
                step1: `${a} - ${b} = ${diff}`,
                step2: `${diff} ÷ ${c} = ${quotient}`
            }
        };
    }

    /**
     * Simple word problems (medium level)
     * @private
     */
    _generateWordProblemSimple() {
        const scenarios = [
            {
                setup: (a, b, c) => `בחנות יש ${a} שקלים. קנו ${b} ספרים ב-${c} שקלים כל אחד. כמה כסף נשאר?`,
                expr: (a, b, c) => `${a} - ${b} × ${c}`,
                calc: (a, b, c) => a - (b * c)
            },
            {
                setup: (a, b, c) => `יש ${a} ילדים בכיתה. כל ילד קיבל ${b} עפרונות. הוסיפו עוד ${c} עפרונות. כמה עפרונות יש בסך הכל?`,
                expr: (a, b, c) => `${a} × ${b} + ${c}`,
                calc: (a, b, c) => a * b + c
            }
        ];

        const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
        const a = Math.floor(Math.random() * 20) + 10;
        const b = Math.floor(Math.random() * 8) + 2;
        const c = Math.floor(Math.random() * 15) + 5;

        const answer = scenario.calc(a, b, c);
        const expression = scenario.expr(a, b, c);

        return {
            type: 'question',
            module: 'order',
            questionText: scenario.setup(a, b, c) + `\n\nפתרי ע"י תרגיל אחד.`,
            questionType: 'input',
            inputPlaceholder: 'הכניסי תשובה',
            correctAnswer: answer,
            explanation: `התרגיל: ${expression} = ${answer}`,
            wordProblem: true,
            expressionHint: expression, // Show after thinking time
            metadata: {
                questionType: 'word_problem_simple',
                expression: expression
            }
        };
    }

    // ========================================
    // Hard Question Types (Complex Word Problems)
    // ========================================

    /**
     * Shopping with multiple items: total - (shirts × price + pants)
     * @private
     */
    _generateShoppingProblem() {
        const total = Math.floor(Math.random() * 30) + 50;
        const shirts = Math.floor(Math.random() * 3) + 2;
        const pricePerShirt = Math.floor(Math.random() * 15) + 10;
        const pants = Math.floor(Math.random() * 20) + 15;

        const shirtsCost = shirts * pricePerShirt;
        const totalSpent = shirtsCost + pants;
        const answer = total - totalSpent;

        const expression = `${total} - (${shirts} × ${pricePerShirt} + ${pants})`;

        return {
            type: 'question',
            module: 'order',
            questionText: `אמה יצאה לקניות עם ${total} שקלים. היא קנה ${shirts} חולצות ב-${pricePerShirt} שקלים כל אחת, ומכנסיים ב-${pants} שקלים. כמה כסף נשאר לה?\n\nפתרי ע"י תרגיל אחד.`,
            questionType: 'input',
            inputPlaceholder: 'הכניסי תשובה',
            correctAnswer: answer,
            explanation: `התרגיל: ${expression}\n\n1) עלות חולצות: ${shirts} × ${pricePerShirt} = ${shirtsCost}\n2) סה"כ קניות: ${shirtsCost} + ${pants} = ${totalSpent}\n3) יתרה: ${total} - ${totalSpent} = ${answer}`,
            wordProblem: true,
            expressionHint: expression,
            metadata: {
                questionType: 'shopping_problem',
                expression: expression
            }
        };
    }

    /**
     * Books in auditorium: rows × cols × perSeat - borrowed
     * @private
     */
    _generateAuditoriumProblem() {
        const rows = Math.floor(Math.random() * 5) + 5;
        const cols = Math.floor(Math.random() * 6) + 4;
        const perSeat = Math.floor(Math.random() * 3) + 6;
        const borrowed = Math.floor(Math.random() * 10) + 5;

        const seats = rows * cols;
        const totalBooks = seats * perSeat;
        const answer = totalBooks - borrowed;

        const expression = `${rows} × ${cols} × ${perSeat} - ${borrowed}`;

        return {
            type: 'question',
            module: 'order',
            questionText: `באולם יש ${rows} שורות של ${cols} כיסאות. בכל כיסא ${perSeat} ספרים. הושאלו ${borrowed} ספרים. כמה ספרים נשארו?\n\nפתרי ע"י תרגיל אחד.`,
            questionType: 'input',
            inputPlaceholder: 'הכניסי תשובה',
            correctAnswer: answer,
            explanation: `התרגיל: ${expression}\n\n1) כיסאות: ${rows} × ${cols} = ${seats}\n2) ספרים: ${seats} × ${perSeat} = ${totalBooks}\n3) נשארו: ${totalBooks} - ${borrowed} = ${answer}`,
            wordProblem: true,
            expressionHint: expression,
            metadata: {
                questionType: 'auditorium_problem',
                expression: expression
            }
        };
    }

    /**
     * Children in classes: (groups × perGroup + additional) ÷ divisor
     * @private
     */
    _generateClassDivisionProblem() {
        // Ensure integer result: pick divisor and quotient first
        const divisor = Math.floor(Math.random() * 4) + 2; // 2-5
        const quotient = Math.floor(Math.random() * 8) + 5; // 5-12 (answer)
        const total = divisor * quotient; // ensure exact division

        // Now distribute total into groups * perGroup + additional
        const groups = Math.floor(Math.random() * 4) + 3; // 3-6
        const perGroup = Math.floor(Math.random() * 5) + 4; // 4-8
        const groupTotal = groups * perGroup;
        const additional = total - groupTotal; // calculate additional to make it work

        // Only use this scenario if additional is positive and reasonable
        if (additional < 1 || additional > 20) {
            // Fallback to simpler values
            const fallbackGroups = 4;
            const fallbackPerGroup = Math.floor(total / fallbackGroups) - 2;
            const fallbackAdditional = total - (fallbackGroups * fallbackPerGroup);

            const expression = `(${fallbackGroups} × ${fallbackPerGroup} + ${fallbackAdditional}) ÷ ${divisor}`;

            return {
                type: 'question',
                module: 'order',
                questionText: `בגן יש ${fallbackGroups} קבוצות של ${fallbackPerGroup} ילדים, ועוד ${fallbackAdditional} ילדים. מחלקים אותם ל-${divisor} כיתות שווים. כמה ילדים בכל כיתה?\n\nפתרי ע"י תרגיל אחד.`,
                questionType: 'input',
                inputPlaceholder: 'הכניסי תשובה',
                correctAnswer: quotient,
                explanation: `התרגיל: ${expression}\n\n1) ילדים בקבוצות: ${fallbackGroups} × ${fallbackPerGroup} = ${fallbackGroups * fallbackPerGroup}\n2) סה"כ ילדים: ${fallbackGroups * fallbackPerGroup} + ${fallbackAdditional} = ${total}\n3) בכל כיתה: ${total} ÷ ${divisor} = ${quotient}`,
                wordProblem: true,
                expressionHint: expression,
                metadata: {
                    questionType: 'class_division_problem',
                    expression: expression
                }
            };
        }

        const expression = `(${groups} × ${perGroup} + ${additional}) ÷ ${divisor}`;

        return {
            type: 'question',
            module: 'order',
            questionText: `בגן יש ${groups} קבוצות של ${perGroup} ילדים, ועוד ${additional} ילדים. מחלקים אותם ל-${divisor} כיתות שווים. כמה ילדים בכל כיתה?\n\nפתרי ע"י תרגיל אחד.`,
            questionType: 'input',
            inputPlaceholder: 'הכניסי תשובה',
            correctAnswer: quotient,
            explanation: `התרגיל: ${expression}\n\n1) ילדים בקבוצות: ${groups} × ${perGroup} = ${groupTotal}\n2) סה"כ ילדים: ${groupTotal} + ${additional} = ${total}\n3) בכל כיתה: ${total} ÷ ${divisor} = ${quotient}`,
            wordProblem: true,
            expressionHint: expression,
            metadata: {
                questionType: 'class_division_problem',
                expression: expression
            }
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
    module.exports = OrderOperationsModule;
}

// Export for ES6
if (typeof exports !== 'undefined') {
    exports.OrderOperationsModule = OrderOperationsModule;
}
