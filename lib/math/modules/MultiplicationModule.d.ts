/**
 * MultiplicationModule TypeScript Definitions
 */

export interface MultiplicationStatistics {
    totalQuestions: number;
    correctAnswers: number;
    currentStreak: number;
    bestStreak: number;
    consecutiveCorrect: number;
    consecutiveWrong: number;
}

export interface MultiplicationConfig {
    initialLevel?: 'קל' | 'בינוני' | 'קשה';
    statistics?: Partial<MultiplicationStatistics>;
}

export interface MultiplicationQuestionViewObject {
    type: 'question';
    module: 'multiplication';
    questionText: string;
    questionType: 'input';
    inputPlaceholder: string;
    correctAnswer: number;
    showCheckButton: true;
    focus: true;
    metadata: {
        num1: number;
        num2: number;
        product: number;
        questionType: 'missingMultiplier' | 'missingMultiplicand' | 'missingProduct' | 'division';
        level: 'קל' | 'בינוני' | 'קשה';
    };
}

export interface DifficultyChange {
    changed: true;
    newLevel: 'קל' | 'בינוני' | 'קשה';
    direction: 'up' | 'down';
}

export interface MultiplicationFeedbackViewObject {
    type: 'feedback';
    module: 'multiplication';
    isCorrect: boolean;
    feedbackType: 'correct' | 'wrong';
    feedbackMessage: string;
    voiceMessage: string | null;
    correctAnswerDisplay: string | null;
    explanationMessage: string | null;
    statistics: MultiplicationStatistics;
    difficultyChange: DifficultyChange | null;
    autoAdvance: boolean;
    autoAdvanceDelay: 1500;
    celebrationTrigger: boolean;
    showNewQuestionButton: boolean;
}

export interface MultiplicationValidationError {
    type: 'validation-error';
    message: string;
}

export type MultiplicationViewObject =
    | MultiplicationQuestionViewObject
    | MultiplicationFeedbackViewObject
    | MultiplicationValidationError;

export class MultiplicationModule {
    constructor(config?: MultiplicationConfig);

    generateQuestion(level?: 'קל' | 'בינוני' | 'קשה'): MultiplicationQuestionViewObject;

    checkAnswer(
        userAnswer: string | number,
        correctAnswer: number,
        currentQuestion: MultiplicationQuestionViewObject
    ): MultiplicationFeedbackViewObject | MultiplicationValidationError;

    getStatistics(): MultiplicationStatistics;

    getCurrentLevel(): 'קל' | 'בינוני' | 'קשה';

    resetStatistics(): void;
}

export default MultiplicationModule;
