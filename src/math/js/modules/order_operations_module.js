/**
 * Emma Math Lab - Order of Operations Module (סדר פעולות חשבון)
 *
 * Implements the pedagogical triad's "grammar" component - teaching order of operations
 * through multi-step word problems that demonstrate WHY the rules exist.
 *
 * Based on pedagogical report: Order of operations is not arbitrary rules to memorize,
 * but the logical "syntax" that emerges from solving real-world multi-step problems.
 *
 * @version 1.0.0
 * @date 2025-11-10
 */

// ============================================================================
// State Management
// ============================================================================

const orderState = {
    level: 'קל',  // קל, בינוני, קשה
    totalQuestions: 0,
    correctAnswers: 0,
    currentStreak: 0,
    bestStreak: 0,
    consecutiveCorrect: 0,
    consecutiveWrong: 0,
    currentQuestion: null,
    currentAnswer: null,
    sessionHistory: [],
    startTime: Date.now(),
    lastSaved: null,
    selectedChoice: null
};

// ============================================================================
// Question Generation
// ============================================================================

/**
 * Generate a new order of operations question
 * Progressive difficulty demonstrates WHY rules exist through word problems
 */
function generateOrderQuestion() {
    const level = orderState.level;

    let question = null;
    let answer = null;

    // Question types based on difficulty
    // קל: Parentheses first, or multiplication before addition
    // בינוני: Mix of all operations with parentheses
    // קשה: Complex expressions with word problems explaining the logic

    if (level === 'קל') {
        // Easy: Focus on single rule application
        const types = ['parens_first', 'mult_before_add'];
        const type = types[Math.floor(Math.random() * types.length)];

        if (type === 'parens_first') {
            // (a + b) × c or a × (b + c)
            const a = Math.floor(Math.random() * 8) + 2;
            const b = Math.floor(Math.random() * 8) + 2;
            const c = Math.floor(Math.random() * 5) + 2;

            if (Math.random() < 0.5) {
                const expr = `(${a} + ${b}) × ${c}`;
                answer = (a + b) * c;
                question = {
                    question: `חשב: ${expr}`,
                    type: 'input',
                    explanation: `קודם פותרים את הסוגריים: ${a} + ${b} = ${a+b}, ואז: ${a+b} × ${c} = ${answer}`,
                    step1: `${a} + ${b} = ${a+b}`,
                    step2: `${a+b} × ${c} = ${answer}`
                };
            } else {
                const expr = `${a} × (${b} + ${c})`;
                answer = a * (b + c);
                question = {
                    question: `חשב: ${expr}`,
                    type: 'input',
                    explanation: `קודם פותרים את הסוגריים: ${b} + ${c} = ${b+c}, ואז: ${a} × ${b+c} = ${answer}`,
                    step1: `${b} + ${c} = ${b+c}`,
                    step2: `${a} × ${b+c} = ${answer}`
                };
            }
        } else {
            // mult_before_add: a + b × c
            const a = Math.floor(Math.random() * 20) + 5;
            const b = Math.floor(Math.random() * 8) + 2;
            const c = Math.floor(Math.random() * 8) + 2;

            const expr = `${a} + ${b} × ${c}`;
            answer = a + (b * c);
            question = {
                question: `חשב: ${expr}`,
                type: 'input',
                explanation: `קודם פותרים את הכפל: ${b} × ${c} = ${b*c}, ואז: ${a} + ${b*c} = ${answer}`,
                step1: `${b} × ${c} = ${b*c}`,
                step2: `${a} + ${b*c} = ${answer}`
            };
        }

    } else if (level === 'בינוני') {
        // Medium: Multiple operations with parentheses
        const types = ['three_ops', 'subtract_divide', 'word_problem_simple'];
        const type = types[Math.floor(Math.random() * types.length)];

        if (type === 'three_ops') {
            // (a + b) × c - d or a × b + c × d
            const a = Math.floor(Math.random() * 10) + 2;
            const b = Math.floor(Math.random() * 10) + 2;
            const c = Math.floor(Math.random() * 5) + 2;
            const d = Math.floor(Math.random() * 15) + 5;

            if (Math.random() < 0.5) {
                const expr = `(${a} + ${b}) × ${c} - ${d}`;
                const step1Result = a + b;
                const step2Result = step1Result * c;
                answer = step2Result - d;
                question = {
                    question: `חשב: ${expr}`,
                    type: 'input',
                    explanation: `1) סוגריים: ${a} + ${b} = ${step1Result}\n2) כפל: ${step1Result} × ${c} = ${step2Result}\n3) חיסור: ${step2Result} - ${d} = ${answer}`,
                    step1: `${a} + ${b} = ${step1Result}`,
                    step2: `${step1Result} × ${c} = ${step2Result}`,
                    step3: `${step2Result} - ${d} = ${answer}`
                };
            } else {
                const expr = `${a} × ${b} + ${c} × ${d}`;
                const mult1 = a * b;
                const mult2 = c * d;
                answer = mult1 + mult2;
                question = {
                    question: `חשב: ${expr}`,
                    type: 'input',
                    explanation: `1) כפל ראשון: ${a} × ${b} = ${mult1}\n2) כפל שני: ${c} × ${d} = ${mult2}\n3) חיבור: ${mult1} + ${mult2} = ${answer}`,
                    step1: `${a} × ${b} = ${mult1}`,
                    step2: `${c} × ${d} = ${mult2}`,
                    step3: `${mult1} + ${mult2} = ${answer}`
                };
            }
        } else if (type === 'subtract_divide') {
            // (a - b) ÷ c
            const c = Math.floor(Math.random() * 5) + 2;
            const quotient = Math.floor(Math.random() * 10) + 3;
            const a = c * quotient + Math.floor(Math.random() * 10) + 5;
            const b = Math.floor(Math.random() * Math.min(10, a - c));

            const expr = `(${a} - ${b}) ÷ ${c}`;
            const diff = a - b;
            answer = Math.floor(diff / c);
            question = {
                question: `חשב: ${expr}`,
                type: 'input',
                explanation: `1) סוגריים: ${a} - ${b} = ${diff}\n2) חילוק: ${diff} ÷ ${c} = ${answer}`,
                step1: `${a} - ${b} = ${diff}`,
                step2: `${diff} ÷ ${c} = ${answer}`
            };
        } else {
            // Simple word problem
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

            answer = scenario.calc(a, b, c);
            question = {
                question: scenario.setup(a, b, c) + `\n\nפתרי ע"י תרגיל אחד.`,
                type: 'input',
                explanation: `התרגיל: ${scenario.expr(a, b, c)} = ${answer}`,
                wordProblem: true
            };
        }

    } else {
        // Hard: Complex multi-step word problems demonstrating WHY rules exist
        const scenarios = [
            {
                setup: () => {
                    const total = Math.floor(Math.random() * 30) + 50;
                    const shirts = Math.floor(Math.random() * 3) + 2;
                    const pricePerShirt = Math.floor(Math.random() * 15) + 10;
                    const pants = Math.floor(Math.random() * 20) + 15;
                    return {
                        text: `אמה יצאה לקניות עם ${total} שקלים. היא קנה ${shirts} חולצות ב-${pricePerShirt} שקלים כל אחת, ומכנסיים ב-${pants} שקלים. כמה כסף נשאר לה?`,
                        expr: `${total} - (${shirts} × ${pricePerShirt} + ${pants})`,
                        answer: total - (shirts * pricePerShirt + pants),
                        explanation: `1) עלות חולצות: ${shirts} × ${pricePerShirt} = ${shirts * pricePerShirt}\n2) סה"כ קניות: ${shirts * pricePerShirt} + ${pants} = ${shirts * pricePerShirt + pants}\n3) יתרה: ${total} - ${shirts * pricePerShirt + pants} = ${total - (shirts * pricePerShirt + pants)}`
                    };
                }
            },
            {
                setup: () => {
                    const rows = Math.floor(Math.random() * 5) + 5;
                    const cols = Math.floor(Math.random() * 6) + 4;
                    const perSeat = Math.floor(Math.random() * 3) + 6;
                    const borrowed = Math.floor(Math.random() * 10) + 5;
                    return {
                        text: `באולם יש ${rows} שורות של ${cols} כיסאות. בכל כיסא ${perSeat} ספרים. הושאלו ${borrowed} ספרים. כמה ספרים נשארו?`,
                        expr: `${rows} × ${cols} × ${perSeat} - ${borrowed}`,
                        answer: rows * cols * perSeat - borrowed,
                        explanation: `1) כיסאות: ${rows} × ${cols} = ${rows * cols}\n2) ספרים: ${rows * cols} × ${perSeat} = ${rows * cols * perSeat}\n3) נשארו: ${rows * cols * perSeat} - ${borrowed} = ${rows * cols * perSeat - borrowed}`
                    };
                }
            },
            {
                setup: () => {
                    const groups = Math.floor(Math.random() * 5) + 4;
                    const perGroup = Math.floor(Math.random() * 6) + 5;
                    const additional = Math.floor(Math.random() * 8) + 3;
                    const divisor = Math.floor(Math.random() * 4) + 2;
                    const total = groups * perGroup + additional;
                    return {
                        text: `בגן יש ${groups} קבוצות של ${perGroup} ילדים, ועוד ${additional} ילדים. מחלקים אותם ל-${divisor} כיתות שווים. כמה ילדים בכל כיתה?`,
                        expr: `(${groups} × ${perGroup} + ${additional}) ÷ ${divisor}`,
                        answer: Math.floor(total / divisor),
                        explanation: `1) ילדים בקבוצות: ${groups} × ${perGroup} = ${groups * perGroup}\n2) סה"כ ילדים: ${groups * perGroup} + ${additional} = ${total}\n3) בכל כיתה: ${total} ÷ ${divisor} = ${Math.floor(total / divisor)}`
                    };
                }
            }
        ];

        const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
        const problem = scenario.setup();

        question = {
            question: problem.text + `\n\nפתרי ע"י תרגיל אחד.`,
            type: 'input',
            explanation: `התרגיל: ${problem.expr}\n\n${problem.explanation}`,
            wordProblem: true,
            showExpression: problem.expr
        };
        answer = problem.answer;
    }

    orderState.currentQuestion = question;
    orderState.currentAnswer = answer;

    // Display question
    document.getElementById('order-question').textContent = question.question;

    // Setup answer interface
    document.getElementById('order-answer-input').style.display = 'inline-block';
    document.getElementById('order-answer-input').value = '';
    document.getElementById('order-answer-input').focus();

    // Hide/show expression hint for word problems
    const expressionHint = document.getElementById('order-expression-hint');
    if (question.wordProblem && question.showExpression) {
        expressionHint.textContent = `רמז: ${question.showExpression}`;
        expressionHint.style.display = 'block';
    } else {
        expressionHint.style.display = 'none';
    }

    // Reset buttons and feedback
    document.getElementById('order-check-btn').style.display = 'inline-block';
    document.getElementById('order-new-question-btn').style.display = 'none';
    document.getElementById('order-feedback').className = 'feedback hidden';
}

// ============================================================================
// Answer Checking
// ============================================================================

/**
 * Check the user's answer to the current order of operations question
 */
function checkOrderAnswer() {
    // Safety check
    if (!orderState.currentQuestion) {
        console.error('No current question available');
        return;
    }

    const userAnswer = parseFloat(document.getElementById('order-answer-input').value);
    const isCorrect = userAnswer === orderState.currentAnswer;

    // Update state
    orderState.totalQuestions++;

    // Add to session history
    orderState.sessionHistory.push({
        question: orderState.currentQuestion.question,
        userAnswer: userAnswer,
        correctAnswer: orderState.currentAnswer,
        isCorrect: isCorrect,
        timestamp: Date.now(),
        level: orderState.level
    });

    // Update statistics
    if (isCorrect) {
        orderState.correctAnswers++;
        orderState.currentStreak++;
        orderState.consecutiveCorrect++;
        orderState.consecutiveWrong = 0;

        if (orderState.currentStreak > orderState.bestStreak) {
            orderState.bestStreak = orderState.currentStreak;
        }
    } else {
        orderState.currentStreak = 0;
        orderState.consecutiveWrong++;
        orderState.consecutiveCorrect = 0;
    }

    saveProgress('order');

    // Show feedback
    const feedback = document.getElementById('order-feedback');
    if (isCorrect) {
        const encouragements = ['מעולה!', 'פנטסטי!', 'את גאונית!', 'כל הכבוד!', 'מושלם!'];
        const encouragement = encouragements[Math.floor(Math.random() * encouragements.length)];

        feedback.className = 'feedback correct';
        feedback.innerHTML = `✅ ${encouragement} תשובה נכונה!`;

        // Show step-by-step explanation
        if (orderState.currentQuestion.explanation) {
            feedback.innerHTML += `<br><br><strong>פתרון:</strong><br>${orderState.currentQuestion.explanation}`;
        }
    } else {
        const encouragements = ['לא נורא!', 'ננסה שוב!', 'כמעט!', 'אפשר ללמוד מטעויות!'];
        const encouragement = encouragements[Math.floor(Math.random() * encouragements.length)];

        feedback.className = 'feedback wrong';
        feedback.innerHTML = `❌ ${encouragement}<br>התשובה הנכונה: ${orderState.currentAnswer}`;

        // Show detailed explanation for wrong answers
        if (orderState.currentQuestion.explanation) {
            feedback.innerHTML += `<br><br><strong>הסבר:</strong><br>${orderState.currentQuestion.explanation}`;
        }
    }

    // Update level based on performance
    adjustOrderDifficulty();
    updateStats('order');

    // Setup for next question
    document.getElementById('order-check-btn').style.display = 'none';
    document.getElementById('order-new-question-btn').style.display = 'inline-block';

    // Auto-generate next question after delay
    if (isCorrect) {
        setTimeout(() => {
            generateOrderQuestion();
        }, 2000);
    }

    // Check for celebrations
    if (orderState.totalQuestions % 10 === 0) {
        showCelebration('order');
    }
}

/**
 * Adjust difficulty based on performance
 */
function adjustOrderDifficulty() {
    if (orderState.consecutiveCorrect >= 3 && orderState.level !== 'קשה') {
        if (orderState.level === 'קל') orderState.level = 'בינוני';
        else if (orderState.level === 'בינוני') orderState.level = 'קשה';
        showLevelUp('order');
        orderState.consecutiveCorrect = 0;
    } else if (orderState.consecutiveWrong >= 2 && orderState.level !== 'קל') {
        if (orderState.level === 'קשה') orderState.level = 'בינוני';
        else if (orderState.level === 'בינוני') orderState.level = 'קל';
        showLevelDown('order');
        orderState.consecutiveWrong = 0;
    }
}

// ============================================================================
// Module Registration
// ============================================================================

// Register module with ModuleRegistry when it loads
if (typeof ModuleRegistry !== 'undefined') {
    ModuleRegistry.register({
        name: 'order',
        title: 'סדר פעולות חשבון',
        storageKey: 'emmaOrderProgress',
        state: () => orderState,
        generateQuestion: generateOrderQuestion,
        checkAnswer: checkOrderAnswer,
        description: 'תרגול סדר פעולות חשבון - סוגריים, כפל וחילוק, חיבור וחיסור',
        questionTypes: ['parens_first', 'mult_before_add', 'three_ops', 'word_problems']
    });

    console.log('✅ Order of Operations module loaded and registered');
} else {
    console.error('❌ ModuleRegistry not found - module not registered');
}
