/**
 * Module Template
 *
 * Copy this file to create a new practice module.
 * Replace all PLACEHOLDERS in ALL CAPS with your module-specific content.
 *
 * File naming: Use lowercase with hyphens (e.g., angles.js, fractions.js)
 *
 * IMPORTANT: Replace "MODULENAME" below with your actual module name (e.g., AnglesModule, FractionsModule)
 */

const MODULENAMEModule = {
    // ========================================
    // Required Metadata
    // ========================================

    name: "שם המודול בעברית",        // e.g., "זוויות בגיאומטריה"
    id: "module-id",                  // e.g., "angles" (lowercase, no spaces)
    icon: "📝",                       // e.g., "📐"
    description: "תיאור קצר",         // e.g., "זיהוי וחישוב זוויות"
    topics: [                           // Array of topics covered
        "נושא 1",
        "נושא 2",
        "נושא 3"
    ],
    targetPages: "עמודים X-Y",       // e.g., "עמודים 8-12"

    // ========================================
    // Required Functions
    // ========================================

    /**
     * Generate a new question
     * @param {string} level - "קל", "בינוני", or "קשה"
     * @returns {object} Question object
     */
    generateQuestion: function(level = 'בינוני') {
        // Your question generation logic here

        // Example for input-type question:
        const num1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1;

        return {
            question: `כמה זה ${num1} + ${num2}?`,
            type: "input",              // "input", "choice", "visual-input", "visual-choice"
            correctAnswer: num1 + num2,
            explanation: `${num1} + ${num2} = ${num1 + num2}`,
            difficulty: level
        };

        // Example for choice-type question:
        /*
        const options = [10, 20, 30, 40];
        const correctIdx = Math.floor(Math.random() * options.length);

        return {
            question: "איזה מספר הכי גדול?",
            type: "choice",
            correctAnswer: Math.max(...options),
            choices: options,
            explanation: `המספר הכי גדול הוא ${Math.max(...options)}`,
            difficulty: level
        };
        */
    },

    /**
     * Check if user's answer is correct
     * @param {any} userAnswer - User's submitted answer
     * @param {any} correctAnswer - The correct answer
     * @param {object} questionData - The question object
     * @returns {boolean} True if correct
     */
    checkAnswer: function(userAnswer, correctAnswer, questionData) {
        // Simple equality check (works for most cases)
        return userAnswer === correctAnswer;

        // For numeric answers with tolerance:
        // return Math.abs(userAnswer - correctAnswer) < 0.01;

        // For string answers (case-insensitive):
        // return userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
    },

    /**
     * Provide a helpful hint
     * @param {object} questionData - The current question
     * @returns {string} Hint text in Hebrew
     */
    getHint: function(questionData) {
        return "💡 רמז מועיל כאן";

        // Example:
        // return "💡 נסי לפרק את המספר לעשרות ויחידות";
    },

    /**
     * Provide detailed explanation
     * @param {object} questionData - The question that was answered
     * @param {any} userAnswer - User's answer
     * @returns {object} Explanation object
     */
    getExplanation: function(questionData, userAnswer) {
        return {
            detailed: questionData.explanation || "הסבר מפורט כאן",
            tip: "טיפ קצר לפעם הבאה",
            nextSteps: "מה לתרגל הלאה"
        };

        // Example:
        /*
        return {
            detailed: `התשובה הנכונה היא ${questionData.correctAnswer}. ${questionData.explanation}`,
            tip: "שימי לב למקום הספרה במספר",
            nextSteps: "תרגלי עם מספרים גדולים יותר"
        };
        */
    },

    // ========================================
    // Optional Functions
    // ========================================

    /**
     * Get difficulty-specific settings (optional)
     * @param {string} level - Difficulty level
     * @returns {object} Custom settings
     */
    getDifficultyRange: function(level) {
        if (level === 'קל') {
            return { min: 1, max: 10, step: 1 };
        } else if (level === 'בינוני') {
            return { min: 10, max: 100, step: 10 };
        } else {
            return { min: 100, max: 1000, step: 100 };
        }
    },

    /**
     * Get module-specific statistics (optional)
     * @param {object} moduleState - Current state of this module
     * @returns {object} Custom statistics
     */
    getStats: function(moduleState) {
        return {
            // Custom stats for this module
        };
    },

    /**
     * Custom CSS for this module (optional)
     */
    customCSS: `
        /* Add module-specific styles here */
        .custom-module-style {
            color: blue;
        }
    `,

    /**
     * Custom HTML for visualizations (optional)
     */
    customHTML: ""
};

// ========================================
// Registration (add this in main HTML)
// ========================================
/*
In Emma_math_lab.html, before </body>:

<script src="js/modules/YOUR-MODULE-FILE.js"></script>
<script>
    // Register the module
    if (typeof moduleRegistry !== 'undefined') {
        moduleRegistry.register('your-module-id', MODULENAMEModule);
    }
</script>
*/

// ========================================
// Testing Your Module
// ========================================
/*
Open browser console and test:

// 1. Verify registration
console.log(moduleRegistry.has('your-module-id')); // Should be true

// 2. Get your module
const myModule = moduleRegistry.get('your-module-id');
console.log(myModule);

// 3. Test question generation
const question = myModule.generateQuestion('בינוני');
console.log(question);

// 4. Test answer checking
const isCorrect = myModule.checkAnswer(42, 42, question);
console.log('Is correct:', isCorrect);

// 5. Test hint
const hint = myModule.getHint(question);
console.log(hint);

// 6. Test explanation
const explanation = myModule.getExplanation(question, 42);
console.log(explanation);
*/
