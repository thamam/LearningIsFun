/**
 * Emma Math Lab - Distributive Property Module (חוק הפילוג)
 *
 * Implements the BRIDGE of the pedagogical triad - connecting place value to multiplication.
 * This is the most critical module according to the pedagogical report.
 *
 * The distributive property is NOT just a "trick" - it's the fundamental principle that:
 * 1. Enables multi-digit multiplication
 * 2. Justifies the standard multiplication algorithm
 * 3. Connects expanded notation to multiplication
 *
 * Example: 7 × 13 = 7 × (10 + 3) = (7 × 10) + (7 × 3) = 70 + 21 = 91
 *
 * @version 1.0.0
 * @date 2025-11-10
 */

// ============================================================================
// State Management
// ============================================================================

const distributiveState = {
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

// Expose to window for navigation patch
window.distributiveState = distributiveState;

// ============================================================================
// Question Generation
// ============================================================================

/**
 * Generate a new distributive property question
 * Progressive difficulty demonstrates the connection to place value
 */
function generateDistributiveQuestion() {
    const level = distributiveState.level;

    let question = null;
    let answer = null;

    if (level === 'קל') {
        // Easy: Visual decomposition with tens and ones
        // Focus on small numbers to build intuition
        const a = Math.floor(Math.random() * 7) + 3; // 3-9
        const tens = Math.floor(Math.random() * 3 + 1) * 10; // 10, 20, or 30
        const ones = Math.floor(Math.random() * 8) + 2; // 2-9
        const b = tens + ones; // 12-39

        const types = ['fill_blank', 'calculate'];
        const type = types[Math.floor(Math.random() * types.length)];

        if (type === 'fill_blank') {
            // Fill in the blank: 7 × 13 = 7 × (10 + 3) = (7 × 10) + (7 × __) = ?
            const missingPart = Math.random() < 0.5 ? 'ones' : 'tens';

            if (missingPart === 'ones') {
                answer = ones;
                question = {
                    question: `${a} × ${b} = ${a} × (${tens} + ${ones})\n= (${a} × ${tens}) + (${a} × ___)\n\nמהו המספר החסר?`,
                    type: 'input',
                    explanation: `התשובה: ${ones}\n\nהסבר: אנחנו מפרקים את ${b} ל-${tens} + ${ones}, ואז מכפילים כל חלק ב-${a}.\nאז צריך: (${a} × ${tens}) + (${a} × ${ones}) = ${a * tens} + ${a * ones} = ${a * b}`
                };
            } else {
                answer = tens;
                question = {
                    question: `${a} × ${b} = ${a} × (${tens} + ${ones})\n= (${a} × ___) + (${a} × ${ones})\n\nמהו המספר החסר?`,
                    type: 'input',
                    explanation: `התשובה: ${tens}\n\nהסבר: אנחנו מפרקים את ${b} ל-${tens} + ${ones}, ואז מכפילים כל חלק ב-${a}.\nאז צריך: (${a} × ${tens}) + (${a} × ${ones}) = ${a * tens} + ${a * ones} = ${a * b}`
                };
            }
        } else {
            // Calculate final answer using distributive property
            answer = a * b;
            question = {
                question: `חשב בעזרת חוק הפילוג:\n\n${a} × ${b} = ${a} × (${tens} + ${ones})\n= (${a} × ${tens}) + (${a} × ${ones})\n= ___ + ___\n= ?`,
                type: 'input',
                explanation: `פתרון:\n1) ${a} × ${tens} = ${a * tens}\n2) ${a} × ${ones} = ${a * ones}\n3) ${a * tens} + ${a * ones} = ${answer}`
            };
        }

        // Show visual area model
        distributiveState.showAreaModel = { factor1: a, factor2: b };

    } else if (level === 'בינוני') {
        // Medium: Larger numbers and both addition/subtraction decomposition
        const a = Math.floor(Math.random() * 8) + 3; // 3-10
        const base = (Math.floor(Math.random() * 9) + 2) * 10; // 20, 30, ..., 100
        const offset = Math.floor(Math.random() * 8) + 1; // 1-8

        const useSubtraction = Math.random() < 0.5;

        if (useSubtraction) {
            // Subtraction: 7 × 19 = 7 × (20 - 1)
            const b = base - offset;
            answer = a * b;

            question = {
                question: `חשב בעזרת חוק הפילוג:\n\n${a} × ${b}\n\nרמז: ${b} = ${base} - ${offset}`,
                type: 'input',
                explanation: `פתרון:\n${a} × ${b} = ${a} × (${base} - ${offset})\n= (${a} × ${base}) - (${a} × ${offset})\n= ${a * base} - ${a * offset}\n= ${answer}\n\n💡 שימוש בחיסור עוזר כשהמספר קרוב לעשרת עגולה!`
            };

            distributiveState.showAreaModel = { factor1: a, factor2: b };
        } else {
            // Addition with larger numbers: 8 × 47 = 8 × (40 + 7)
            const b = base + offset;
            const tens = Math.floor(b / 10) * 10;
            const ones = b % 10;
            answer = a * b;

            question = {
                question: `חשב בעזרת חוק הפילוג:\n\n${a} × ${b}\n\nרמז: ${b} = ${tens} + ${ones}`,
                type: 'input',
                explanation: `פתרון:\n${a} × ${b} = ${a} × (${tens} + ${ones})\n= (${a} × ${tens}) + (${a} × ${ones})\n= ${a * tens} + ${a * ones}\n= ${answer}`
            };

            distributiveState.showAreaModel = { factor1: a, factor2: b };
        }

    } else {
        // Hard: Three-digit numbers and connection to standard algorithm
        const a = Math.floor(Math.random() * 6) + 4; // 4-9
        const hundreds = (Math.floor(Math.random() * 3) + 1) * 100; // 100, 200, 300
        const tens = Math.floor(Math.random() * 10) * 10; // 0-90
        const ones = Math.floor(Math.random() * 10); // 0-9
        const b = hundreds + tens + ones; // 100-399

        answer = a * b;

        const h = Math.floor(b / 100) * 100;
        const t = Math.floor((b % 100) / 10) * 10;
        const o = b % 10;

        let decomposition = '';
        let calculation = '';
        const parts = [];

        if (h > 0) {
            parts.push(`(${a} × ${h})`);
            calculation += `${a} × ${h} = ${a * h}\n`;
        }
        if (t > 0) {
            parts.push(`(${a} × ${t})`);
            calculation += `${a} × ${t} = ${a * t}\n`;
        }
        if (o > 0) {
            parts.push(`(${a} × ${o})`);
            calculation += `${a} × ${o} = ${a * o}\n`;
        }

        decomposition = parts.join(' + ');

        const sumParts = [];
        if (h > 0) sumParts.push(`${a * h}`);
        if (t > 0) sumParts.push(`${a * t}`);
        if (o > 0) sumParts.push(`${a * o}`);

        question = {
            question: `חשב בעזרת חוק הפילוג:\n\n${a} × ${b.toLocaleString('en-US')}`,
            type: 'input',
            explanation: `פתרון מלא:\n\n1) פירוק עשרוני: ${b.toLocaleString('en-US')} = ${h > 0 ? h : ''}${t > 0 ? ' + ' + t : ''}${o > 0 ? ' + ' + o : ''}\n\n2) חוק הפילוג:\n${a} × ${b.toLocaleString('en-US')} = ${decomposition}\n\n3) חישוב:\n${calculation}\n4) חיבור:\n${sumParts.join(' + ')} = ${answer.toLocaleString('en-US')}\n\n💡 זה בדיוק מה שקורה באלגוריתם הכפל המאונך!`
        };

        // For large numbers, show that this IS the vertical algorithm
        question.connectionToAlgorithm = true;
        distributiveState.showAreaModel = { factor1: a, factor2: b };
    }

    distributiveState.currentQuestion = question;
    distributiveState.currentAnswer = answer;

    // Display question
    document.getElementById('distributive-question').textContent = question.question;

    // Show area model for visual learners
    if (distributiveState.showAreaModel) {
        displayAreaModel(
            distributiveState.showAreaModel.factor1,
            distributiveState.showAreaModel.factor2,
            'distributive-visual-container'
        );
    } else {
        hideVisualModel('distributive-visual-container');
    }

    // Setup answer interface
    const inputEl = document.getElementById('distributive-answer-input');
    inputEl.style.display = 'inline-block';
    inputEl.value = '';
    inputEl.focus();

    // Add Enter key support
    inputEl.onkeypress = function(e) {
        if (e.key === 'Enter') {
            checkDistributiveAnswer();
        }
    };

    // Reset buttons and feedback
    document.getElementById('distributive-check-btn').style.display = 'inline-block';
    document.getElementById('distributive-new-question-btn').style.display = 'none';
    document.getElementById('distributive-feedback').className = 'feedback hidden';
}

// ============================================================================
// Answer Checking
// ============================================================================

/**
 * Check the user's answer to the current distributive property question
 */
function checkDistributiveAnswer() {
    // Safety check
    if (!distributiveState.currentQuestion) {
        console.error('No current question available');
        return;
    }

    const userAnswer = parseFloat(document.getElementById('distributive-answer-input').value);
    const isCorrect = userAnswer === distributiveState.currentAnswer;

    // Update state
    distributiveState.totalQuestions++;

    // Add to session history
    distributiveState.sessionHistory.push({
        question: distributiveState.currentQuestion.question,
        userAnswer: userAnswer,
        correctAnswer: distributiveState.currentAnswer,
        isCorrect: isCorrect,
        timestamp: Date.now(),
        level: distributiveState.level
    });

    // Update statistics
    if (isCorrect) {
        distributiveState.correctAnswers++;
        distributiveState.currentStreak++;
        distributiveState.consecutiveCorrect++;
        distributiveState.consecutiveWrong = 0;

        if (distributiveState.currentStreak > distributiveState.bestStreak) {
            distributiveState.bestStreak = distributiveState.currentStreak;
        }
    } else {
        distributiveState.currentStreak = 0;
        distributiveState.consecutiveWrong++;
        distributiveState.consecutiveCorrect = 0;
    }

    saveProgress('distributive');

    // Show feedback
    const feedback = document.getElementById('distributive-feedback');
    if (isCorrect) {
        const encouragements = ['מעולה!', 'פנטסטי!', 'את גאונית!', 'כל הכבוד!', 'מושלם!'];
        const encouragement = encouragements[Math.floor(Math.random() * encouragements.length)];

        feedback.className = 'feedback correct';
        feedback.innerHTML = `✅ ${encouragement} תשובה נכונה!`;

        // Show explanation
        if (distributiveState.currentQuestion.explanation) {
            feedback.innerHTML += `<br><br><div style="text-align: right; font-size: 11pt; line-height: 1.8;">${distributiveState.currentQuestion.explanation}</div>`;
        }
    } else {
        const encouragements = ['לא נורא!', 'ננסה שוב!', 'כמעט!', 'אפשר ללמוד מטעויות!'];
        const encouragement = encouragements[Math.floor(Math.random() * encouragements.length)];

        feedback.className = 'feedback wrong';
        feedback.innerHTML = `❌ ${encouragement}<br>התשובה הנכונה: ${distributiveState.currentAnswer}`;

        // Show detailed explanation
        if (distributiveState.currentQuestion.explanation) {
            feedback.innerHTML += `<br><br><div style="text-align: right; font-size: 11pt; line-height: 1.8;">${distributiveState.currentQuestion.explanation}</div>`;
        }
    }

    // Update level based on performance
    adjustDistributiveDifficulty();
    updateStats('distributive');

    // Setup for next question
    document.getElementById('distributive-check-btn').style.display = 'none';
    document.getElementById('distributive-new-question-btn').style.display = 'inline-block';

    // Auto-generate next question after delay
    if (isCorrect) {
        setTimeout(() => {
            generateDistributiveQuestion();
        }, 2500); // Longer delay to read explanation
    }

    // Check for celebrations
    if (distributiveState.totalQuestions % 10 === 0) {
        showCelebration('distributive');
    }
}

/**
 * Adjust difficulty based on performance
 */
function adjustDistributiveDifficulty() {
    if (distributiveState.consecutiveCorrect >= 3 && distributiveState.level !== 'קשה') {
        if (distributiveState.level === 'קל') distributiveState.level = 'בינוני';
        else if (distributiveState.level === 'בינוני') distributiveState.level = 'קשה';
        showLevelUp('distributive');
        distributiveState.consecutiveCorrect = 0;
    } else if (distributiveState.consecutiveWrong >= 2 && distributiveState.level !== 'קל') {
        if (distributiveState.level === 'קשה') distributiveState.level = 'בינוני';
        else if (distributiveState.level === 'בינוני') distributiveState.level = 'קל';
        showLevelDown('distributive');
        distributiveState.consecutiveWrong = 0;
    }
}

// ============================================================================
// Module Registration
// ============================================================================

// Register module with ModuleRegistry when it loads
if (typeof ModuleRegistry !== 'undefined') {
    ModuleRegistry.register({
        name: 'distributive',
        title: 'חוק הפילוג',
        storageKey: 'emmaDistributiveProgress',
        state: () => distributiveState,
        generateQuestion: generateDistributiveQuestion,
        checkAnswer: checkDistributiveAnswer,
        description: 'תרגול חוק הפילוג - הגשר בין מבנה עשרוני לכפל',
        questionTypes: ['fill_blank', 'calculate', 'connection_to_algorithm']
    });

    console.log('✅ Distributive Property module loaded and registered');
} else {
    console.error('❌ ModuleRegistry not found - module not registered');
}
