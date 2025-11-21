/**
 * TypeScript interface for DivisionModule
 * Use in Next.js for type safety
 */

export interface DivisionModuleConfig {
    initialLevel?: 'קל' | 'בינוני' | 'קשה';
    statistics?: ModuleStatistics;
}

export interface ModuleStatistics {
    totalQuestions: number;
    correctAnswers: number;
    currentStreak: number;
    bestStreak: number;
    consecutiveCorrect: number;
    consecutiveWrong: number;
}

export interface QuestionViewObject {
    type: 'question';
    module: 'division';
    timestamp: number;
    difficulty: 'קל' | 'בינוני' | 'קשה';

    questionText: string;
    equation: string | null;
    showEquation: boolean;

    questionType: 'input';
    inputValue: string;
    inputPlaceholder: string;
    inputType: 'number';
    focus: boolean;
    showInput: boolean;

    correctAnswer: number;
    metadata: {
        dividend?: number;
        divisor?: number;
        quotient?: number;
        total?: number;
        groups?: number;
        perGroup?: number;
        questionType: 'basicDivision' | 'missingDividend' | 'missingDivisor' | 'wordProblem';
    };

    showCheckButton: boolean;
    showNextButton: boolean;
    showHintButton: boolean;

    hint: string;
    hintVisible: boolean;
}

export interface FeedbackViewObject {
    type: 'feedback';
    module: 'division';
    timestamp: number;

    isCorrect: boolean;
    userAnswer: number | string;
    correctAnswer: number | string;

    feedbackType: 'correct' | 'wrong';
    feedbackMessage: string;
    encouragement: string;
    feedbackIcon: '✅' | '❌';

    explanation: string | null;
    showExplanation: boolean;
    hint: string;

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

    nextAction: 'generate_next' | 'show_hint';
    autoAdvance: boolean;
    autoAdvanceDelay: number;

    showCelebration: boolean;
}

export class DivisionModule {
    constructor(config?: DivisionModuleConfig);

    generateQuestion(level?: 'קל' | 'בינוני' | 'קשה'): QuestionViewObject;
    checkAnswer(userAnswer: number | string, correctAnswer: number | string): FeedbackViewObject;
    getStatistics(): ModuleStatistics;
    getCurrentLevel(): 'קל' | 'בינוני' | 'קשה';
    resetStatistics(): void;
}
