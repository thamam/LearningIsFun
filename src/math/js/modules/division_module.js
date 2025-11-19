function generateDivisionQuestion() {
    // Removed divisionWithRemainder - not yet in curriculum
    const types = ['basicDivision', 'missingDividend', 'missingDivisor', 'wordProblem'];
    const type = types[Math.floor(Math.random() * types.length)];
    let question = {};
    let answer;
    function getDivisionRange() {
        if (divisionState.level === 'קל') {
            return { maxQuotient: 10, divisors: [2, 3, 4, 5] };
        } else if (divisionState.level === 'בינוני') {
            return { maxQuotient: 12, divisors: [2, 3, 4, 5, 6, 7, 8] };
        } else {
            return { maxQuotient: 15, divisors: [2, 3, 4, 5, 6, 7, 8, 9, 10, 12] };
        }
    }
    const range = getDivisionRange();
    switch (type) {
        case 'basicDivision':
            const divisor1 = range.divisors[Math.floor(Math.random() * range.divisors.length)];
            const quotient1 = Math.floor(Math.random() * range.maxQuotient) + 1;
            const dividend1 = divisor1 * quotient1;
            answer = quotient1;
            question = {
                question: `חשבי:`,
                equation: `${dividend1} ÷ ${divisor1} = ___`,
                type: 'input'
            };
            break;
        case 'divisionWithRemainder':
            const divisor2 = range.divisors[Math.floor(Math.random() * range.divisors.length)];
            const quotient2 = Math.floor(Math.random() * range.maxQuotient) + 1;
            const remainder = Math.floor(Math.random() * (divisor2 - 1)) + 1;
            const dividend2 = (divisor2 * quotient2) + remainder;
            answer = `${quotient2} שארית ${remainder}`;
            question = {
                question: `חשבי (כולל שארית):`,
                equation: `${dividend2} ÷ ${divisor2} = ___`,
                type: 'input'
            };
            break;
        case 'missingDividend':
            const divisor3 = range.divisors[Math.floor(Math.random() * range.divisors.length)];
            const quotient3 = Math.floor(Math.random() * range.maxQuotient) + 1;
            const dividend3 = divisor3 * quotient3;
            answer = dividend3;
            question = {
                question: `מצאי את המספר החסר:`,
                equation: `___ ÷ ${divisor3} = ${quotient3}`,
                type: 'input'
            };
            break;
        case 'missingDivisor':
            const divisor4 = range.divisors[Math.floor(Math.random() * range.divisors.length)];
            const quotient4 = Math.floor(Math.random() * range.maxQuotient) + 1;
            const dividend4 = divisor4 * quotient4;
            answer = divisor4;
            question = {
                question: `מצאי את המספר החסר:`,
                equation: `${dividend4} ÷ ___ = ${quotient4}`,
                type: 'input'
            };
            break;
        case 'wordProblem':
            const problems = [
                'לאמה יש {total} עוגיות. היא רוצה לחלק אותן שווה ב-{groups} קבוצות. כמה עוגיות בכל קבוצה?',
                'יש {total} תפוחים ו-{groups} סלים. כמה תפוחים יהיו בכל סל אם נחלק שווה?',
                'אמה קראה {total} עמודים ב-{groups} ימים, כל יום אותו מספר עמודים. כמה עמודים קראה כל יום?'
            ];
            const problem = problems[Math.floor(Math.random() * problems.length)];
            const groups = range.divisors[Math.floor(Math.random() * range.divisors.length)];
            const perGroup = Math.floor(Math.random() * range.maxQuotient) + 1;
            const total = groups * perGroup;
            answer = perGroup;
            // Word problems don't need equation field - Hebrew text with numbers embedded
            question = {
                question: problem.replace('{total}', total).replace('{groups}', groups),
                type: 'input'
            };
            break;
    }
    divisionState.currentQuestion = question;
    divisionState.currentAnswer = answer;

    // Display question with proper formatting
    const questionEl = document.getElementById('division-question');
    const equationEl = document.getElementById('division-equation');

    if (question.equation) {
        // Use separate containers for Hebrew text and equation
        questionEl.textContent = question.question;
        equationEl.textContent = question.equation;
        equationEl.style.display = 'block';
    } else {
        // Word problems - just show the question text
        questionEl.textContent = question.question;
        equationEl.style.display = 'none';
    }

    const inputEl = document.getElementById('division-answer-input');
    inputEl.style.display = 'inline-block';
    inputEl.value = '';
    inputEl.focus();

    // Add Enter key support
    inputEl.onkeypress = function(e) {
        if (e.key === 'Enter') {
            checkDivisionAnswer();
        }
    };

    document.getElementById('division-check-btn').style.display = 'inline-block';
    document.getElementById('division-new-question-btn').style.display = 'none';
    document.getElementById('division-feedback').className = 'feedback hidden';
}
function checkDivisionAnswer() {
    if (!divisionState.currentQuestion) { console.error('No current question available'); return; }
    const userAnswer = document.getElementById('division-answer-input').value.trim();
    if (!userAnswer) { alert('אנא הכניסי תשובה!'); return; }
    let isCorrect = false;
    const correctAnswer = divisionState.currentAnswer;
    if (typeof correctAnswer === 'number') {
        isCorrect = parseFloat(userAnswer) === correctAnswer;
    } else {
        isCorrect = userAnswer.replace(/\s+/g, ' ').trim() === correctAnswer.replace(/\s+/g, ' ').trim();
    }
    divisionState.totalQuestions++;
    divisionState.sessionHistory.push({
        timestamp: Date.now(), question: divisionState.currentQuestion.question,
        userAnswer: userAnswer, correctAnswer: correctAnswer,
        isCorrect: isCorrect, level: divisionState.level,
    });
    if (isCorrect) {
        divisionState.correctAnswers++; divisionState.currentStreak++;
        divisionState.consecutiveCorrect++; divisionState.consecutiveWrong = 0;
        if (divisionState.currentStreak > divisionState.bestStreak) {
            divisionState.bestStreak = divisionState.currentStreak;
        }
    } else {
        divisionState.currentStreak = 0;
        divisionState.consecutiveWrong++;
        divisionState.consecutiveCorrect = 0;
    }
    adjustDivisionDifficulty(); saveProgress('division'); updateStats('division');
    const feedback = document.getElementById('division-feedback');
    if (isCorrect) {
        const encouragements = ['מעולה!', 'פנטסטי!', 'את גאונית!', 'כל הכבוד!', 'מושלם!', 'יופי!'];
        const encouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
        feedback.className = 'feedback correct';
        feedback.innerHTML = `✅ ${encouragement} תשובה נכונה!<br>🔊 כל הכבוד אמה!`;
    } else {
        const encouragements = ['לא נורא!', 'ננסה שוב!', 'כמעט!', 'אפשר ללמוד מטעויות!', 'בפעם הבאה!'];
        const encouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
        feedback.className = 'feedback wrong';
        feedback.innerHTML = `❌ ${encouragement}<br>התשובה הנכונה: ${correctAnswer}<br>💡 טיפ: חשבי על לוח הכפל!`;
    }
    feedback.classList.remove('hidden');
    document.getElementById('division-check-btn').style.display = 'none';
    document.getElementById('division-new-question-btn').style.display = 'inline-block';
    if (isCorrect) { setTimeout(() => { generateDivisionQuestion(); }, 1500); }
    if (divisionState.totalQuestions % 10 === 0) { showCelebration('division'); }
}
function adjustDivisionDifficulty() {
    if (divisionState.consecutiveCorrect >= 3 && divisionState.level !== 'קשה') {
        if (divisionState.level === 'קל') divisionState.level = 'בינוני';
        else if (divisionState.level === 'בינוני') divisionState.level = 'קשה';
        showLevelUp('division'); divisionState.consecutiveCorrect = 0;
    } else if (divisionState.consecutiveWrong >= 2 && divisionState.level !== 'קל') {
        if (divisionState.level === 'קשה') divisionState.level = 'בינוני';
        else if (divisionState.level === 'בינוני') divisionState.level = 'קל';
        showLevelDown('division'); divisionState.consecutiveWrong = 0;
    }
}
window.generateDivisionQuestion = generateDivisionQuestion;
window.checkDivisionAnswer = checkDivisionAnswer;

// Register with ModuleRegistry
if (typeof ModuleRegistry !== 'undefined') {
    ModuleRegistry.register({
        name: 'division',
        title: 'חילוק',
        storageKey: 'emmaDivisionProgress',
        state: () => window.divisionState,
        generateQuestion: window.generateDivisionQuestion,
        checkAnswer: window.checkDivisionAnswer,
        description: 'תרגול חילוק - חילוק פשוט, שאריות, תרגילי מילה',
        questionTypes: ['basicDivision', 'divisionWithRemainder', 'missingDividend', 'missingDivisor', 'wordProblem']
    });
    console.log('✅ Division Module Registered with ModuleRegistry');
}
