/**
 * DistributiveModule TypeScript Definitions
 */

export interface DistributiveStatistics {
    totalQuestions: number;
    correctAnswers: number;
    currentStreak: number;
    bestStreak: number;
    consecutiveCorrect: number;
    consecutiveWrong: number;
}

export interface DistributiveConfig {
    initialLevel?: 'קל' | 'בינוני' | 'קשה';
    statistics?: Partial<DistributiveStatistics>;
}

/**
 * Area Model Data - JSON representation for visual rendering
 * Contains factor decomposition for area model visualization
 */
export interface AreaModelData {
    factor1: number;
    factor2: number;
    decomposition: {
        // For easy/medium (two-digit factor2):
        tens?: number;
        ones?: number;
        operation?: 'addition' | 'subtraction';

        // For hard (three-digit factor2):
        hundreds?: number;

        // Additional fields for subtraction decomposition:
        base?: number;
        offset?: number;
    };
}

export interface DistributiveQuestionViewObject {
    type: 'question';
    module: 'distributive';
    questionText: string;
    questionType: 'input';
    inputPlaceholder: string;
    correctAnswer: number;
    explanation: string; // Always present, shown after answer
    areaModel: AreaModelData; // Visual data for client-side rendering
    connectionToAlgorithm?: boolean; // True for hard questions
    metadata: {
        questionType: 'fill_blank' | 'calculate' | 'addition_decomposition' | 'subtraction_decomposition' | 'three_digit';
        [key: string]: any; // Additional metadata per question type
    };
}

export interface DifficultyChange {
    changed: true;
    newLevel: 'קל' | 'בינוני' | 'קשה';
    direction: 'up' | 'down';
}

export interface DistributiveFeedbackViewObject {
    type: 'feedback';
    module: 'distributive';
    isCorrect: boolean;
    feedbackType: 'correct' | 'wrong';
    feedbackMessage: string;
    correctAnswerDisplay: string | null; // Only present if wrong
    explanation: string; // Always present (pedagogical)
    statistics: DistributiveStatistics;
    difficultyChange: DifficultyChange | null;
    autoAdvance: boolean;
    autoAdvanceDelay: 2500; // Fixed at 2.5 seconds to read explanations
    celebrationTrigger: boolean; // True if totalQuestions is multiple of 10
    showNewQuestionButton: boolean; // True if wrong answer
}

export interface DistributiveValidationError {
    type: 'validation-error';
    message: string;
}

export type DistributiveViewObject =
    | DistributiveQuestionViewObject
    | DistributiveFeedbackViewObject
    | DistributiveValidationError;

export class DistributiveModule {
    constructor(config?: DistributiveConfig);

    generateQuestion(level?: 'קל' | 'בינוני' | 'קשה'): DistributiveQuestionViewObject;

    checkAnswer(
        userAnswer: string | number,
        correctAnswer: number,
        currentQuestion: DistributiveQuestionViewObject
    ): DistributiveFeedbackViewObject | DistributiveValidationError;

    getStatistics(): DistributiveStatistics;

    getCurrentLevel(): 'קל' | 'בינוני' | 'קשה';

    resetStatistics(): void;
}

export default DistributiveModule;
