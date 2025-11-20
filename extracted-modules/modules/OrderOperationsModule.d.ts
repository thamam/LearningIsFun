/**
 * OrderOperationsModule TypeScript Definitions
 */

export interface OrderStatistics {
    totalQuestions: number;
    correctAnswers: number;
    currentStreak: number;
    bestStreak: number;
    consecutiveCorrect: number;
    consecutiveWrong: number;
}

export interface OrderConfig {
    initialLevel?: 'קל' | 'בינוני' | 'קשה';
    statistics?: Partial<OrderStatistics>;
}

export interface OrderQuestionViewObject {
    type: 'question';
    module: 'order';
    questionText: string;
    equation?: string; // Present for simple equations (not word problems)
    questionType: 'input';
    inputPlaceholder: string;
    correctAnswer: number;
    explanation: string; // Step-by-step solution
    wordProblem?: boolean; // True for word problems
    expressionHint?: string; // Mathematical expression for word problems
    metadata: {
        questionType:
            | 'parens_first'
            | 'mult_before_add'
            | 'three_ops'
            | 'subtract_divide'
            | 'word_problem_simple'
            | 'shopping_problem'
            | 'auditorium_problem'
            | 'class_division_problem';
        expression: string;
        step1?: string;
        step2?: string;
        step3?: string;
    };
}

export interface DifficultyChange {
    changed: true;
    newLevel: 'קל' | 'בינוני' | 'קשה';
    direction: 'up' | 'down';
}

export interface OrderFeedbackViewObject {
    type: 'feedback';
    module: 'order';
    isCorrect: boolean;
    feedbackType: 'correct' | 'wrong';
    feedbackMessage: string;
    correctAnswerDisplay: string | null;
    explanation: string; // Always present (for both correct and wrong)
    explanationLabel: 'פתרון:' | 'הסבר:'; // "Solution" for correct, "Explanation" for wrong
    statistics: OrderStatistics;
    difficultyChange: DifficultyChange | null;
    autoAdvance: boolean;
    autoAdvanceDelay: 2000;
    celebrationTrigger: boolean;
    showNewQuestionButton: boolean;
}

export interface OrderValidationError {
    type: 'validation-error';
    message: string;
}

export type OrderViewObject =
    | OrderQuestionViewObject
    | OrderFeedbackViewObject
    | OrderValidationError;

export class OrderOperationsModule {
    constructor(config?: OrderConfig);

    generateQuestion(level?: 'קל' | 'בינוני' | 'קשה'): OrderQuestionViewObject;

    checkAnswer(
        userAnswer: string | number,
        correctAnswer: number,
        currentQuestion: OrderQuestionViewObject
    ): OrderFeedbackViewObject | OrderValidationError;

    getStatistics(): OrderStatistics;

    getCurrentLevel(): 'קל' | 'בינוני' | 'קשה';

    resetStatistics(): void;
}

export default OrderOperationsModule;
