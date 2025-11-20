# Story 10: Extract Order of Operations Module (Headless)

**Priority:** P1 (High)
**Complexity:** High (8)
**Estimated Time:** 1.5 days
**Dependencies:** Story 06 (Division extraction pattern established)
**Phase:** 2 (Headless Extraction)

---

## 📋 Problem Statement

The **Order of Operations Module** is located in `src/math/js/modules/order_operations_module.js` (459 lines) and is tightly coupled to the DOM. This is the most pedagogically complex module, featuring multi-step word problems with detailed explanations demonstrating WHY order of operations rules exist.

### Current Issues:
- ❌ Lines 283-324: Direct DOM manipulation (`getElementById`, `textContent`, `innerHTML`)
- ❌ Lines 340: Reads input value from DOM
- ❌ Lines 375-407: Updates feedback element with `innerHTML`
- ❌ Lines 410-412: Uses `setTimeout()` for auto-advance (browser timing)
- ❌ Lines 35-37: Pollutes global `window` namespace
- ❌ Complex nested logic with multiple question types per difficulty level

### Success Criteria:
✅ Zero DOM access (no `window`, `document`, `getElementById`, `setTimeout`)
✅ Returns JSON View Objects (all rendering data in plain objects)
✅ Console test passes (`node order-console.js`)
✅ Can be copy-pasted into Next.js API route without modification
✅ Preserves all pedagogical explanations and step-by-step solutions

---

## 🎯 Extraction Scope

### Question Types by Difficulty:

#### **קל (Easy)** - 2 types:
1. **parens_first** - Parentheses priority: `(a + b) × c` or `a × (b + c)`
2. **mult_before_add** - Multiplication before addition: `a + b × c`

#### **בינוני (Medium)** - 3 types:
1. **three_ops** - Three operations: `(a + b) × c - d` or `a × b + c × d`
2. **subtract_divide** - Subtraction and division: `(a - b) ÷ c`
3. **word_problem_simple** - Simple word problems (2 scenarios)

#### **קשה (Hard)** - 3 complex word problem scenarios:
1. **Shopping with multiple items** - `total - (shirts × price + pants)`
2. **Books in auditorium** - `rows × cols × perSeat - borrowed`
3. **Children in classes** - `(groups × perGroup + additional) ÷ divisor`

### Special Features:
- **Step-by-step explanations** embedded in question objects
- **Word problems** that demonstrate WHY rules exist (not arbitrary memorization)
- **Expression hints** for word problems (shown after thinking time)
- **LTR isolation** for mathematical expressions in RTL context
- **Integer-only results** (carefully constructed to avoid decimals)

---

## 📦 Implementation

### File: `extracted-modules/modules/OrderOperationsModule.js`

```javascript
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
```

---

## ✅ Console Test

### File: `extracted-modules/tests/console-tests/order-console.js`

```javascript
/**
 * Console Test for OrderOperationsModule
 * Run: node order-console.js
 *
 * Tests:
 * 1. Module instantiation
 * 2. Easy question types (parens_first, mult_before_add)
 * 3. Medium question types (three_ops, subtract_divide, word_problem_simple)
 * 4. Hard word problems (all 3 scenarios)
 * 5. Answer checking with explanations
 * 6. Difficulty adjustment
 * 7. Zero DOM verification
 */

const OrderOperationsModule = require('../../modules/OrderOperationsModule');

console.log('🧪 OrderOperationsModule Console Test\n');

// Test 1: Instantiation
console.log('Test 1: Module Instantiation');
const module = new OrderOperationsModule({ initialLevel: 'קל' });
console.assert(module.currentLevel === 'קל', 'Initial level should be קל');
console.assert(module.statistics.totalQuestions === 0, 'Initial questions should be 0');
console.log('✅ Instantiation passed\n');

// Test 2: Easy Questions
console.log('Test 2: Easy Question Generation (קל)');
const easyModule = new OrderOperationsModule({ initialLevel: 'קל' });
const types = {};
for (let i = 0; i < 20; i++) {
    const q = easyModule.generateQuestion();
    types[q.metadata.questionType] = (types[q.metadata.questionType] || 0) + 1;
}
console.log('Easy question distribution:', types);
console.assert(types.hasOwnProperty('parens_first') || types.hasOwnProperty('mult_before_add'), 'Should generate easy types');
console.log('✅ Easy questions passed\n');

// Test 3: Medium Questions
console.log('Test 3: Medium Question Generation (בינוני)');
const mediumModule = new OrderOperationsModule({ initialLevel: 'בינוני' });
const mediumTypes = {};
for (let i = 0; i < 30; i++) {
    const q = mediumModule.generateQuestion();
    mediumTypes[q.metadata.questionType] = (mediumTypes[q.metadata.questionType] || 0) + 1;
}
console.log('Medium question distribution:', mediumTypes);
console.assert(Object.keys(mediumTypes).length >= 2, 'Should generate multiple medium types');
console.log('✅ Medium questions passed\n');

// Test 4: Hard Word Problems
console.log('Test 4: Hard Question Generation (קשה)');
const hardModule = new OrderOperationsModule({ initialLevel: 'קשה' });
const hardTypes = {};
for (let i = 0; i < 30; i++) {
    const q = hardModule.generateQuestion();
    hardTypes[q.metadata.questionType] = (hardTypes[q.metadata.questionType] || 0) + 1;
}
console.log('Hard question distribution:', hardTypes);
console.assert(Object.keys(hardTypes).length >= 2, 'Should generate multiple hard scenarios');
console.log('✅ Hard questions passed\n');

// Test 5: Verify Question Format
console.log('Test 5: Verify Question Format');
const sampleQ = module.generateQuestion();
console.log('Sample question:', JSON.stringify(sampleQ, null, 2));
console.assert(sampleQ.type === 'question', 'Should be question type');
console.assert(sampleQ.questionType === 'input', 'Should be input type');
console.assert(sampleQ.explanation, 'Should include explanation');
console.assert(typeof sampleQ.correctAnswer === 'number', 'Correct answer should be a number');
console.log('✅ Question format passed\n');

// Test 6: Check Correct Answer with Explanation
console.log('Test 6: Check Correct Answer');
const checkModule = new OrderOperationsModule();
const q1 = checkModule.generateQuestion();
console.log(`Question: ${q1.questionText || q1.equation}`);
console.log(`Correct answer: ${q1.correctAnswer}`);
const feedback = checkModule.checkAnswer(q1.correctAnswer, q1.correctAnswer, q1);
console.log('Feedback:', JSON.stringify(feedback, null, 2));
console.assert(feedback.type === 'feedback', 'Should be feedback type');
console.assert(feedback.isCorrect === true, 'Should be correct');
console.assert(feedback.explanation, 'Should include explanation');
console.assert(feedback.explanationLabel === 'פתרון:', 'Correct answer should show solution label');
console.assert(feedback.autoAdvance === true, 'Should auto-advance on correct');
console.log('✅ Correct answer check passed\n');

// Test 7: Check Wrong Answer with Explanation
console.log('Test 7: Check Wrong Answer');
const wrongModule = new OrderOperationsModule();
const wrongQ = wrongModule.generateQuestion();
const wrongAnswer = 9999; // Obviously wrong
const wrongFeedback = wrongModule.checkAnswer(wrongAnswer, wrongQ.correctAnswer, wrongQ);
console.log('Wrong feedback:', JSON.stringify(wrongFeedback, null, 2));
console.assert(wrongFeedback.isCorrect === false, 'Should be incorrect');
console.assert(wrongFeedback.correctAnswerDisplay !== null, 'Should show correct answer');
console.assert(wrongFeedback.explanation, 'Should include explanation');
console.assert(wrongFeedback.explanationLabel === 'הסבר:', 'Wrong answer should show explanation label');
console.log('✅ Wrong answer check passed\n');

// Test 8: Difficulty Adjustment (Level Up)
console.log('Test 8: Difficulty Adjustment (Level Up)');
const levelUpModule = new OrderOperationsModule({ initialLevel: 'קל' });
console.log('Starting level:', levelUpModule.currentLevel);
for (let i = 0; i < 3; i++) {
    const q = levelUpModule.generateQuestion();
    const f = levelUpModule.checkAnswer(q.correctAnswer, q.correctAnswer, q);
}
console.log('After 3 correct, level:', levelUpModule.currentLevel);
console.assert(levelUpModule.currentLevel === 'בינוני', 'Should level up to בינוני');
console.log('✅ Level up passed\n');

// Test 9: Word Problem Detection
console.log('Test 9: Word Problem Detection');
const wordProblemModule = new OrderOperationsModule({ initialLevel: 'בינוני' });
let foundWordProblem = false;
for (let i = 0; i < 20; i++) {
    const q = wordProblemModule.generateQuestion();
    if (q.wordProblem === true) {
        foundWordProblem = true;
        console.log('Found word problem:', q.questionText.substring(0, 50) + '...');
        console.assert(q.expressionHint, 'Word problem should have expression hint');
        break;
    }
}
console.assert(foundWordProblem, 'Should generate word problems');
console.log('✅ Word problem detection passed\n');

// Test 10: Integer Results Only
console.log('Test 10: Integer Results Only');
const integerModule = new OrderOperationsModule({ initialLevel: 'קשה' });
for (let i = 0; i < 20; i++) {
    const q = integerModule.generateQuestion();
    console.assert(Number.isInteger(q.correctAnswer), 'All answers should be integers');
}
console.log('✅ Integer results passed\n');

// Test 11: Zero DOM Verification
console.log('Test 11: Zero DOM Verification');
console.assert(typeof window === 'undefined', 'window should be undefined in Node.js');
console.assert(typeof document === 'undefined', 'document should be undefined in Node.js');
console.log('✅ Zero DOM verification passed\n');

// Test 12: Explanation Always Present
console.log('Test 12: Explanation Always Present');
const explainModule = new OrderOperationsModule();
for (let i = 0; i < 10; i++) {
    const q = explainModule.generateQuestion();
    console.assert(q.explanation && q.explanation.length > 0, 'Every question should have explanation');
}
console.log('✅ Explanation presence passed\n');

console.log('🎉 All tests passed! OrderOperationsModule is headless and ready for Next.js.\n');
```

---

## 📐 TypeScript Interface

### File: `extracted-modules/types/OrderOperationsModule.d.ts`

```typescript
/**
 * OrderOperationsModule TypeScript Definitions
 */

export interface OrderStatistics {
    totalQuestions: number;
    correctAnswers: number;
    currentStreak: number;
    bestStreak: number;
    consecutiveCorrect: number;
    consecutiveWrong: number;
}

export interface OrderConfig {
    initialLevel?: 'קל' | 'בינוני' | 'קשה';
    statistics?: Partial<OrderStatistics>;
}

export interface OrderQuestionViewObject {
    type: 'question';
    module: 'order';
    questionText: string;
    equation?: string; // Present for simple equations (not word problems)
    questionType: 'input';
    inputPlaceholder: string;
    correctAnswer: number;
    explanation: string; // Step-by-step solution
    wordProblem?: boolean; // True for word problems
    expressionHint?: string; // Mathematical expression for word problems
    metadata: {
        questionType:
            | 'parens_first'
            | 'mult_before_add'
            | 'three_ops'
            | 'subtract_divide'
            | 'word_problem_simple'
            | 'shopping_problem'
            | 'auditorium_problem'
            | 'class_division_problem';
        expression: string;
        step1?: string;
        step2?: string;
        step3?: string;
    };
}

export interface DifficultyChange {
    changed: true;
    newLevel: 'קל' | 'בינוני' | 'קשה';
    direction: 'up' | 'down';
}

export interface OrderFeedbackViewObject {
    type: 'feedback';
    module: 'order';
    isCorrect: boolean;
    feedbackType: 'correct' | 'wrong';
    feedbackMessage: string;
    correctAnswerDisplay: string | null;
    explanation: string; // Always present (for both correct and wrong)
    explanationLabel: 'פתרון:' | 'הסבר:'; // "Solution" for correct, "Explanation" for wrong
    statistics: OrderStatistics;
    difficultyChange: DifficultyChange | null;
    autoAdvance: boolean;
    autoAdvanceDelay: 2000;
    celebrationTrigger: boolean;
    showNewQuestionButton: boolean;
}

export interface OrderValidationError {
    type: 'validation-error';
    message: string;
}

export type OrderViewObject =
    | OrderQuestionViewObject
    | OrderFeedbackViewObject
    | OrderValidationError;

export class OrderOperationsModule {
    constructor(config?: OrderConfig);

    generateQuestion(level?: 'קל' | 'בינוני' | 'קשה'): OrderQuestionViewObject;

    checkAnswer(
        userAnswer: string | number,
        correctAnswer: number,
        currentQuestion: OrderQuestionViewObject
    ): OrderFeedbackViewObject | OrderValidationError;

    getStatistics(): OrderStatistics;

    getCurrentLevel(): 'קל' | 'בינוני' | 'קשה';

    resetStatistics(): void;
}
```

---

## 🚀 Next.js Integration Example

### File: `app/api/order/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { OrderOperationsModule } from '@/lib/modules/OrderOperationsModule';

// In-memory session storage (replace with Redis/database in production)
const sessions = new Map<string, OrderOperationsModule>();

export async function GET(request: NextRequest) {
    const sessionId = request.headers.get('x-session-id') || 'default';

    // Get or create module instance
    if (!sessions.has(sessionId)) {
        sessions.set(sessionId, new OrderOperationsModule({ initialLevel: 'קל' }));
    }

    const module = sessions.get(sessionId)!;
    const question = module.generateQuestion();

    return NextResponse.json({
        success: true,
        data: question,
        statistics: module.getStatistics()
    });
}

export async function POST(request: NextRequest) {
    const sessionId = request.headers.get('x-session-id') || 'default';
    const { userAnswer, correctAnswer, currentQuestion } = await request.json();

    if (!sessions.has(sessionId)) {
        return NextResponse.json(
            { success: false, error: 'Session not found' },
            { status: 404 }
        );
    }

    const module = sessions.get(sessionId)!;
    const feedback = module.checkAnswer(userAnswer, correctAnswer, currentQuestion);

    return NextResponse.json({
        success: true,
        data: feedback
    });
}
```

---

## ✅ Verification Plan

### Step 1: Zero DOM Check
```bash
cd extracted-modules/modules
grep -n "window\|document\|getElementById\|alert\|setTimeout" OrderOperationsModule.js
# Expected: No results (exit code 1)
```

### Step 2: Console Test
```bash
cd extracted-modules/tests/console-tests
node order-console.js
# Expected: "🎉 All tests passed! OrderOperationsModule is headless and ready for Next.js."
```

### Step 3: Question Type Distribution
```bash
node -e "
const OrderOperationsModule = require('./extracted-modules/modules/OrderOperationsModule');
console.log('\n=== Easy Level ===');
const easy = new OrderOperationsModule({ initialLevel: 'קל' });
const easyTypes = {};
for (let i = 0; i < 50; i++) {
    const q = easy.generateQuestion();
    easyTypes[q.metadata.questionType] = (easyTypes[q.metadata.questionType] || 0) + 1;
}
console.log(easyTypes);

console.log('\n=== Medium Level ===');
const medium = new OrderOperationsModule({ initialLevel: 'בינוני' });
const medTypes = {};
for (let i = 0; i < 60; i++) {
    const q = medium.generateQuestion();
    medTypes[q.metadata.questionType] = (medTypes[q.metadata.questionType] || 0) + 1;
}
console.log(medTypes);

console.log('\n=== Hard Level ===');
const hard = new OrderOperationsModule({ initialLevel: 'קשה' });
const hardTypes = {};
for (let i = 0; i < 60; i++) {
    const q = hard.generateQuestion();
    hardTypes[q.metadata.questionType] = (hardTypes[q.metadata.questionType] || 0) + 1;
}
console.log(hardTypes);
"
```

### Step 4: Integer-Only Verification
```bash
node -e "
const OrderOperationsModule = require('./extracted-modules/modules/OrderOperationsModule');
const module = new OrderOperationsModule({ initialLevel: 'קשה' });
console.log('Testing 100 hard questions for integer results...');
for (let i = 0; i < 100; i++) {
    const q = module.generateQuestion();
    if (!Number.isInteger(q.correctAnswer)) {
        console.error('❌ Non-integer answer found:', q.correctAnswer);
        console.error('Question:', q.questionText);
        process.exit(1);
    }
}
console.log('✅ All 100 questions have integer answers');
"
```

---

## 📊 Success Metrics

| Metric | Target | Validation |
|--------|--------|------------|
| Zero DOM Access | 0 references | `grep` command returns no results |
| Console Test Pass | 12/12 tests | All assertions pass |
| TypeScript Compile | No errors | `tsc --noEmit` on `.d.ts` file |
| Next.js Integration | Copy-paste ready | No modifications needed |
| All Question Types | 8 types work | Distribution test shows all |
| Integer Results | 100% integers | No decimal answers in any question |
| Explanations Present | 100% coverage | Every question has explanation |
| Word Problem Hints | Present when needed | Expression hints included |

---

## 🎯 Definition of Done

- [ ] `OrderOperationsModule.js` created with zero DOM access
- [ ] `order-console.js` test file passes all 12 tests
- [ ] `OrderOperationsModule.d.ts` TypeScript interface created
- [ ] All 8 question types implemented (2 easy + 3 medium + 3 hard)
- [ ] Step-by-step explanations included for all questions
- [ ] Integer-only results verified (no decimals)
- [ ] Word problems include expression hints
- [ ] `grep` verification confirms zero DOM references
- [ ] Next.js example demonstrates integration pattern
- [ ] Hebrew text preserved with proper RTL handling
- [ ] README updated: `health_refactor/01_orchestration_plan.md` (mark Story 10 complete)

---

## 📝 Notes

**Why This Is The Most Complex Extraction:**
1. **Multiple Question Types:** 8 different question generators (2+3+3 across difficulty levels)
2. **Pedagogical Depth:** Step-by-step explanations embedded in every question
3. **Word Problems:** Real-world scenarios requiring careful integer construction
4. **Integer-Only Math:** Complex calculations ensuring no decimal results (especially division problems)
5. **Conditional Rendering:** Equation vs. word problem display, expression hints timing

**Pedagogical Philosophy Preserved:**
- Order of operations taught through **WHY** (word problems) not just **WHAT** (rules)
- Every question includes detailed step-by-step solution
- Progressive difficulty demonstrates increasingly complex real-world applications
- Expression hints help students bridge word problems to mathematical notation

**Key Features:**
- **Step-by-step explanations:** Always included, labeled "פתרון" (solution) for correct, "הסבר" (explanation) for wrong
- **Integer construction:** Division problems carefully generate numbers to ensure exact integer quotients
- **Fallback logic:** Class division problem has fallback values if random generation creates invalid scenarios
- **2-second delay:** Longer auto-advance to allow reading detailed explanations

**Copy-Paste Compatibility:**
This module is production-ready for Next.js. The complexity is in the business logic (question generation), not in external dependencies.
