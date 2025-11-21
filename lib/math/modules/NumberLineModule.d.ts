/**
 * NumberLineModule TypeScript Definitions
 */

export interface NumberLineStatistics {
    totalQuestions: number;
    correctAnswers: number;
    currentStreak: number;
    bestStreak: number;
    consecutiveCorrect: number;
    consecutiveWrong: number;
}

export interface NumberLineConfig {
    initialLevel?: 'קל' | 'בינוני' | 'קשה';
    statistics?: Partial<NumberLineStatistics>;
}

export interface VisualMarker {
    value: number;
    position: number; // 0-100 percentage
    label: string;
}

export interface VisualMinorTick {
    value: number;
    position: number; // 0-100 percentage
}

export interface VisualArrow {
    value: number;
    position: number; // 0-100 percentage
    symbol: string; // '⬇️'
}

export interface VisualRange {
    min: number;
    max: number;
    interval: number;
}

export interface VisualDisplay {
    min: number;
    max: number;
    range: number;
}

export interface VisualData {
    range: VisualRange;
    display: VisualDisplay;
    majorMarkers: VisualMarker[];
    minorTicks: VisualMinorTick[];
    arrow: VisualArrow | null;
}

export interface AcceptableRange {
    min: number;
    max: number;
}

export interface NumberLineChoice {
    id: number;
    text: string;
    value: number;
}

export interface NumberLineQuestionViewObject {
    type: 'question';
    module: 'numberline';
    questionText: string;
    questionType: 'input' | 'visual-input' | 'choice';
    inputPlaceholder?: string; // For input types
    choices?: NumberLineChoice[]; // For choice type
    correctAnswer: number;
    acceptableRange?: AcceptableRange | null; // For approximate answers
    visualData: VisualData | null; // Only for visual questions
    metadata: {
        questionType: 'whatIsNumber' | 'betweenNumbers' | 'closerTo';
        arrowPosition?: number;
        useExactWithHint?: boolean;
        num1?: number;
        num2?: number;
        testNum?: number;
        option1?: number;
        option2?: number;
    };
}

export interface DifficultyChange {
    changed: true;
    newLevel: 'קל' | 'בינוני' | 'קשה';
    direction: 'up' | 'down';
}

export interface NumberLineFeedbackViewObject {
    type: 'feedback';
    module: 'numberline';
    isCorrect: boolean;
    feedbackType: 'correct' | 'wrong';
    feedbackMessage: string;
    voiceMessage: string | null;
    correctAnswerDisplay: string | null; // Only present if wrong
    statistics: NumberLineStatistics;
    difficultyChange: DifficultyChange | null;
    autoAdvance: boolean;
    autoAdvanceDelay: 1500; // Fixed at 1.5 seconds
    celebrationTrigger: boolean; // True if totalQuestions is multiple of 10
    showNewQuestionButton: boolean; // True if wrong answer
}

export interface NumberLineValidationError {
    type: 'validation-error';
    message: string;
}

export type NumberLineViewObject =
    | NumberLineQuestionViewObject
    | NumberLineFeedbackViewObject
    | NumberLineValidationError;

export class NumberLineModule {
    constructor(config?: NumberLineConfig);

    generateQuestion(level?: 'קל' | 'בינוני' | 'קשה'): NumberLineQuestionViewObject;

    checkAnswer(
        userAnswer: string | number,
        correctAnswer: number,
        currentQuestion: NumberLineQuestionViewObject
    ): NumberLineFeedbackViewObject | NumberLineValidationError;

    getStatistics(): NumberLineStatistics;

    getCurrentLevel(): 'קל' | 'בינוני' | 'קשה';

    resetStatistics(): void;
}

export default NumberLineModule;
