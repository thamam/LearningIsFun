/**
 * FractionModule TypeScript Definitions
 */

export interface FractionStatistics {
    totalQuestions: number;
    correctAnswers: number;
    currentStreak: number;
    bestStreak: number;
    consecutiveCorrect: number;
    consecutiveWrong: number;
}

export interface FractionConfig {
    initialLevel?: 'קל' | 'בינוני' | 'קשה';
    statistics?: Partial<FractionStatistics>;
    enabledTypes?: Array<'compare' | 'addSameDenominator' | 'simplify' | 'fractionToDecimal' | 'decimalToFraction'>;
}

export interface FractionChoice {
    id: number;
    text: string;
    value: string;
    ltr?: boolean; // Force LTR direction for symbols like <, >, =
}

export interface FractionQuestionViewObject {
    type: 'question';
    module: 'fraction';
    questionText: string;
    equation?: string; // Optional equation display (e.g., "3/4 + 1/4 = ___")
    questionType: 'input' | 'choice';
    choices?: FractionChoice[]; // Present if questionType === 'choice'
    inputPlaceholder?: string; // Present if questionType === 'input'
    correctAnswer: string | number;
    metadata: {
        questionType: 'compare' | 'addSameDenominator' | 'simplify' | 'fractionToDecimal' | 'decimalToFraction';
        [key: string]: any; // Additional metadata per question type
    };
}

export interface DifficultyChange {
    changed: true;
    newLevel: 'קל' | 'בינוני' | 'קשה';
    direction: 'up' | 'down';
}

export interface FractionFeedbackViewObject {
    type: 'feedback';
    module: 'fraction';
    isCorrect: boolean;
    feedbackType: 'correct' | 'wrong';
    feedbackMessage: string;
    voiceMessage: string | null;
    correctAnswerDisplay: string | null; // Only present if wrong
    tipMessage: string | null; // Only present if wrong
    statistics: FractionStatistics;
    difficultyChange: DifficultyChange | null;
    autoAdvance: boolean;
    celebrationTrigger: boolean; // True if totalQuestions is multiple of 10
    showNewQuestionButton: boolean;
}

export interface FractionValidationError {
    type: 'validation-error';
    message: string;
}

export type FractionViewObject =
    | FractionQuestionViewObject
    | FractionFeedbackViewObject
    | FractionValidationError;

export class FractionModule {
    constructor(config?: FractionConfig);

    generateQuestion(level?: 'קל' | 'בינוני' | 'קשה'): FractionQuestionViewObject;

    checkAnswer(
        userAnswer: string | number,
        correctAnswer: string | number,
        currentQuestion: FractionQuestionViewObject
    ): FractionFeedbackViewObject | FractionValidationError;

    getStatistics(): FractionStatistics;

    getCurrentLevel(): 'קל' | 'בינוני' | 'קשה';

    resetStatistics(): void;
}

export default FractionModule;
