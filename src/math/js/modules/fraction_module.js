function generateFractionQuestion() {
    // Removed fractionToDecimal and decimalToFraction - not yet in curriculum
    const types = ['compare', 'addSameDenominator', 'simplify'];
    const type = types[Math.floor(Math.random() * types.length)];
    let question = {};
    let answer;
    function getFractionRange() {
        if (fractionState.level === 'קל') {
            return { maxNumerator: 4, denominators: [2, 4] };
        } else if (fractionState.level === 'בינוני') {
            return { maxNumerator: 8, denominators: [2, 3, 4, 5, 6] };
        } else {
            return { maxNumerator: 12, denominators: [2, 3, 4, 5, 6, 8, 10, 12] };
        }
    }
    function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }
    function simplifyFraction(num, den) {
        const divisor = gcd(num, den);
        return { num: num / divisor, den: den / divisor };
    }
    const range = getFractionRange();
    // LTR embedding characters for proper RTL display
    const LTR_START = '\u202A';
    const LTR_END = '\u202C';

    switch (type) {
        case 'compare':
            const den1 = range.denominators[Math.floor(Math.random() * range.denominators.length)];
            const num1 = Math.floor(Math.random() * den1) + 1;
            const num2 = Math.floor(Math.random() * den1) + 1;
            const choices = ['>', '<', '='];
            // Determine answer: num1/den1 compared to num2/den1
            // Since same denominator, just compare numerators
            if (num1 > num2) answer = '>';
            else if (num1 < num2) answer = '<';
            else answer = '=';
            // Build equation with explicit left and right fractions
            // Format: [LEFT] ___ [RIGHT], answer compares LEFT to RIGHT
            const leftFraction = `${num1}/${den1}`;
            const rightFraction = `${num2}/${den1}`;
            question = {
                question: `מה הסימן הנכון?`,
                equation: `${leftFraction} ___ ${rightFraction}`,
                type: 'choice',
                choices: choices,
                // Store for debugging
                leftFraction: leftFraction,
                rightFraction: rightFraction,
                expectedAnswer: answer
            };
            console.log(`Compare: ${leftFraction} ___ ${rightFraction}, Answer: ${answer}`);
            break;
        case 'addSameDenominator':
            const den = range.denominators[Math.floor(Math.random() * range.denominators.length)];
            const n1 = Math.floor(Math.random() * (den - 1)) + 1;
            const n2 = Math.floor(Math.random() * (den - n1)) + 1;
            const sum = n1 + n2;
            const simplified = simplifyFraction(sum, den);
            if (simplified.den === 1) {
                // Result is a whole number
                answer = simplified.num;
                question = {
                    question: `חשבי:`,
                    equation: `${n1}/${den} + ${n2}/${den} = ___`,
                    type: 'input'
                };
            } else if (simplified.num === sum && simplified.den === den) {
                // Result doesn't need simplification - ask for just numerator
                answer = sum;  // Just the numerator, not the full fraction
                question = {
                    question: `חשבי:`,
                    equation: `${n1}/${den} + ${n2}/${den} = ___/${den}`,
                    type: 'input'
                };
            } else {
                // Result needs simplification
                answer = `${simplified.num}/${simplified.den}`;
                question = {
                    question: `חשבי וצמצמי:`,
                    equation: `${n1}/${den} + ${n2}/${den} = ___`,
                    type: 'input'
                };
            }
            break;
        case 'simplify':
            const baseDen = range.denominators[Math.floor(Math.random() * range.denominators.length)];
            const multiplier = Math.floor(Math.random() * 3) + 2;
            const numToSimplify = Math.floor(Math.random() * (baseDen - 1) + 1) * multiplier;
            const denToSimplify = baseDen * multiplier;
            const result = simplifyFraction(numToSimplify, denToSimplify);
            answer = `${result.num}/${result.den}`;
            question = {
                question: `צמצמי:`,
                equation: `${numToSimplify}/${denToSimplify} = ___`,
                type: 'input'
            };
            break;
        case 'fractionToDecimal':
            const fractionPairs = [
                { num: 1, den: 2, decimal: 0.5 }, { num: 1, den: 4, decimal: 0.25 },
                { num: 3, den: 4, decimal: 0.75 }, { num: 1, den: 5, decimal: 0.2 },
                { num: 2, den: 5, decimal: 0.4 }, { num: 3, den: 5, decimal: 0.6 },
                { num: 4, den: 5, decimal: 0.8 }, { num: 1, den: 10, decimal: 0.1 },
                { num: 3, den: 10, decimal: 0.3 }
            ];
            const pair = fractionPairs[Math.floor(Math.random() * fractionPairs.length)];
            answer = pair.decimal;
            const toDecEq = LTR_START + `${pair.num}/${pair.den} = ___` + LTR_END;
            question = { question: `כתבי כעשרוני: ${toDecEq}`, type: 'input' };
            break;
        case 'decimalToFraction':
            const decimalOptions = [
                { decimal: 0.5, num: 1, den: 2 }, { decimal: 0.25, num: 1, den: 4 },
                { decimal: 0.75, num: 3, den: 4 }, { decimal: 0.2, num: 1, den: 5 },
                { decimal: 0.4, num: 2, den: 5 }
            ];
            const decPair = decimalOptions[Math.floor(Math.random() * decimalOptions.length)];
            answer = `${decPair.num}/${decPair.den}`;
            const toFracEq = LTR_START + `${decPair.decimal} = ___` + LTR_END;
            question = { question: `כתבי כשבר: ${toFracEq}`, type: 'input' };
            break;
    }
    fractionState.currentQuestion = question;
    fractionState.currentAnswer = answer;

    // Display question with proper formatting
    const questionEl = document.getElementById('fraction-question');
    const equationEl = document.getElementById('fraction-equation');

    if (question.equation) {
        // Use separate containers for Hebrew text and equation
        questionEl.textContent = question.question;
        equationEl.textContent = question.equation;
        equationEl.style.display = 'block';
    } else {
        questionEl.textContent = question.question;
        equationEl.style.display = 'none';
    }
    const inputEl = document.getElementById('fraction-answer-input');
    const choiceEl = document.getElementById('fraction-choice-buttons');
    if (question.type === 'input') {
        inputEl.style.display = 'inline-block';
        choiceEl.style.display = 'none';
        inputEl.value = '';
        inputEl.focus();
        // Add Enter key support
        inputEl.onkeypress = function(e) {
            if (e.key === 'Enter') {
                checkFractionAnswer();
            }
        };
    } else {
        inputEl.style.display = 'none';
        choiceEl.style.display = 'flex';
        choiceEl.innerHTML = '';
        question.choices.forEach(choice => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            // Force LTR direction on buttons to prevent < and > from flipping
            btn.style.direction = 'ltr';
            btn.style.unicodeBidi = 'isolate';
            btn.textContent = choice;
            btn.onclick = function() { selectFractionChoice(choice, this); };
            choiceEl.appendChild(btn);
        });
    }
    document.getElementById('fraction-check-btn').style.display = 'inline-block';
    document.getElementById('fraction-new-question-btn').style.display = 'none';
    document.getElementById('fraction-feedback').className = 'feedback hidden';
}
function selectFractionChoice(choice, button) {
    // Remove selection from all buttons and reset their style
    document.querySelectorAll('#fraction-choice-buttons .choice-btn').forEach(btn => {
        btn.classList.remove('selected');
        btn.style.background = 'white';
        btn.style.color = 'black';
        btn.style.border = '2px solid #2196f3';
    });
    // Highlight selected button
    button.classList.add('selected');
    button.style.background = '#2196f3';
    button.style.color = 'white';
    button.style.border = '3px solid #1565c0';
    fractionState.selectedChoice = choice;
}
function checkFractionAnswer() {
    if (!fractionState.currentQuestion) { console.error('No current question available'); return; }
    let userAnswer;
    if (fractionState.currentQuestion.type === 'input') {
        userAnswer = document.getElementById('fraction-answer-input').value.trim();
    } else {
        userAnswer = fractionState.selectedChoice;
    }
    if (!userAnswer) { alert('אנא הכניסי תשובה!'); return; }
    let isCorrect = false;
    const correctAnswer = fractionState.currentAnswer;
    console.log('=== Fraction Answer Check ===');
    console.log('User answer:', userAnswer, 'type:', typeof userAnswer);
    console.log('Correct answer:', correctAnswer, 'type:', typeof correctAnswer);
    if (typeof correctAnswer === 'number') {
        isCorrect = parseFloat(userAnswer) === correctAnswer;
    } else {
        const userClean = userAnswer.toString().replace(/\s/g, '');
        const correctClean = correctAnswer.toString().replace(/\s/g, '');
        isCorrect = userClean === correctClean;
        console.log('Cleaned user:', userClean, 'Cleaned correct:', correctClean, 'Match:', isCorrect);
    }
    fractionState.totalQuestions++;
    fractionState.sessionHistory.push({
        timestamp: Date.now(), question: fractionState.currentQuestion.question,
        userAnswer: userAnswer, correctAnswer: correctAnswer,
        isCorrect: isCorrect, level: fractionState.level,
    });
    if (isCorrect) {
        fractionState.correctAnswers++; fractionState.currentStreak++;
        fractionState.consecutiveCorrect++; fractionState.consecutiveWrong = 0;
        if (fractionState.currentStreak > fractionState.bestStreak) {
            fractionState.bestStreak = fractionState.currentStreak;
        }
    } else {
        fractionState.currentStreak = 0;
        fractionState.consecutiveWrong++;
        fractionState.consecutiveCorrect = 0;
    }
    adjustFractionDifficulty(); saveProgress('fraction'); updateStats('fraction');
    const feedback = document.getElementById('fraction-feedback');
    if (isCorrect) {
        const encouragements = ['מעולה!', 'פנטסטי!', 'את גאונית!', 'כל הכבוד!', 'מושלם!', 'יופי!'];
        const encouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
        feedback.className = 'feedback correct';
        feedback.innerHTML = `✅ ${encouragement} תשובה נכונה!<br>🔊 כל הכבוד אמה!`;
    } else {
        const encouragements = ['לא נורא!', 'ננסה שוב!', 'כמעט!', 'אפשר ללמוד מטעויות!', 'בפעם הבאה!'];
        const encouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
        feedback.className = 'feedback wrong';
        feedback.innerHTML = `❌ ${encouragement}<br>התשובה הנכונה: ${correctAnswer}<br>💡 טיפ: תרגלי צמצום שברים!`;
    }
    feedback.classList.remove('hidden');
    document.getElementById('fraction-check-btn').style.display = 'none';
    document.getElementById('fraction-new-question-btn').style.display = 'inline-block';
    if (isCorrect) { setTimeout(() => { generateFractionQuestion(); }, 1500); }
    if (fractionState.totalQuestions % 10 === 0) { showCelebration('fraction'); }
}
function adjustFractionDifficulty() {
    if (fractionState.consecutiveCorrect >= 3 && fractionState.level !== 'קשה') {
        if (fractionState.level === 'קל') fractionState.level = 'בינוני';
        else if (fractionState.level === 'בינוני') fractionState.level = 'קשה';
        showLevelUp('fraction'); fractionState.consecutiveCorrect = 0;
    } else if (fractionState.consecutiveWrong >= 2 && fractionState.level !== 'קל') {
        if (fractionState.level === 'קשה') fractionState.level = 'בינוני';
        else if (fractionState.level === 'בינוני') fractionState.level = 'קל';
        showLevelDown('fraction'); fractionState.consecutiveWrong = 0;
    }
}
window.generateFractionQuestion = generateFractionQuestion;
window.checkFractionAnswer = checkFractionAnswer;
window.selectFractionChoice = selectFractionChoice;

// Register with ModuleRegistry
if (typeof ModuleRegistry !== 'undefined') {
    ModuleRegistry.register({
        name: 'fraction',
        title: 'שברים',
        storageKey: 'emmaFractionProgress',
        state: () => window.fractionState,
        generateQuestion: window.generateFractionQuestion,
        checkAnswer: window.checkFractionAnswer,
        selectChoice: window.selectFractionChoice,
        description: 'תרגול שברים - השוואה, חיבור, צמצום, המרה לעשרוני',
        questionTypes: ['compare', 'addSameDenominator', 'simplify', 'fractionToDecimal', 'decimalToFraction']
    });
    console.log('✅ Fraction Module Registered with ModuleRegistry');
}
