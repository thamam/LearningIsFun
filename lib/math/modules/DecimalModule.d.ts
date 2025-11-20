/**
 * TypeScript Definitions for DecimalModule (Headless)
 *
 * Pure JavaScript class for decimal number practice.
 * Zero DOM dependencies - returns JSON View Objects.
 */

/**
 * Range-based answer object (for missingDigit questions)
 */
export interface RangeAnswer {
    type: 'range';
    min: number;
    max: number;
    pattern: string;
    missingPos: number;
    originalDigit: number;
}

/**
 * Difficulty configuration for a level
 */
export interface DifficultyRange {
    min: number;
    max: number;
    digits: number;
}

/**
 * Statistics tracking object
 */
export interface Statistics {
    totalQuestions: number;
    correctAnswers: number;
    currentStreak: number;
    bestStreak: number;
    consecutiveCorrect: number;
    consecutiveWrong: number;
}

/**
 * Question View Object (returned by generateQuestion)
 */
export interface QuestionViewObject {
    type: 'question';
    module: 'decimal';
    timestamp: number;
    difficulty: 'קל' | 'בינוני' | 'קשה';

    questionText: string;
    questionType: 'input' | 'choice';

    // For input questions
    inputValue?: string;
    inputPlaceholder?: string;
    showInput: boolean;

    // For choice questions
    choices?: string[];
    selectedChoice?: string | null;
    showChoices: boolean;

    correctAnswer: number | string | RangeAnswer;
    metadata: {
        questionType: 'decomposition' | 'digitValue' | 'nextPrevious' | 'compare' | 'missingDigit';
        [key: string]: any;
    };

    showCheckButton: boolean;
    showNextButton: boolean;
    focus: boolean;
}

/**
 * Feedback View Object (returned by checkAnswer)
 */
export interface FeedbackViewObject {
    type: 'feedback';
    module: 'decimal';
    timestamp: number;

    isCorrect: boolean;
    userAnswer: number | string | RangeAnswer;
    correctAnswer: string;

    feedbackType: 'correct' | 'wrong';
    feedbackMessage: string;
    encouragement: string;
    feedbackIcon: '✅' | '❌';

    explanation: string | null;
    showExplanation: boolean;

    showCheckButton: boolean;
    showNextButton: boolean;
    enableInput: boolean;

    statistics: {
        totalQuestions: number;
        correctAnswers: number;
        currentStreak: number;
        bestStreak: number;
        accuracy: number;
        scoreDisplay: string;
    };

    difficultyChange: 'level_up' | 'level_down' | null;
    newDifficulty: 'קל' | 'בינוני' | 'קשה';

    autoAdvance: boolean;
    autoAdvanceDelay: number;
    showCelebration: boolean;
}

/**
 * Configuration options for DecimalModule
 */
export interface DecimalModuleConfig {
    initialLevel?: 'קל' | 'בינוני' | 'קשה';
    statistics?: Statistics;
}

/**
 * DecimalModule - Headless decimal number practice module
 *
 * @example
 * const decimalModule = new DecimalModule({ initialLevel: 'קל' });
 * const question = decimalModule.generateQuestion();
 * const feedback = decimalModule.checkAnswer(userInput, question.correctAnswer);
 */
export class DecimalModule {
    currentLevel: 'קל' | 'בינוני' | 'קשה';
    statistics: Statistics;
    difficultyConfig: {
        'קל': DifficultyRange;
        'בינוני': DifficultyRange;
        'קשה': DifficultyRange;
    };
    questionTypes: Array<'decomposition' | 'digitValue' | 'nextPrevious' | 'compare' | 'missingDigit'>;
    hebrewText: {
        encouragements: {
            correct: string[];
            wrong: string[];
        };
    };

    /**
     * Initialize decimal module
     * @param config - Configuration options
     */
    constructor(config?: DecimalModuleConfig);

    /**
     * Generate a new decimal question
     * @param level - Difficulty level (defaults to current level)
     * @returns View Object with question data
     */
    generateQuestion(level?: 'קל' | 'בינוני' | 'קשה'): QuestionViewObject;

    /**
     * Validate user answer
     * @param userAnswer - User's answer
     * @param correctAnswer - Expected answer (can be number, string, or range object)
     * @returns View Object with feedback data
     */
    checkAnswer(
        userAnswer: number | string,
        correctAnswer: number | string | RangeAnswer
    ): FeedbackViewObject;

    /**
     * Get current statistics
     * @returns Copy of current statistics
     */
    getStatistics(): Statistics;

    /**
     * Get current difficulty level
     * @returns Current level
     */
    getCurrentLevel(): 'קל' | 'בינוני' | 'קשה';

    /**
     * Reset statistics (new session)
     */
    resetStatistics(): void;
}

/**
 * Default export
 */
export default DecimalModule;
