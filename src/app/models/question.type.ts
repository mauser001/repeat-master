export type Question = {
    id: number;
    category: string;
    description: string;
    correctAnswers: string[];
    type: 'select' | 'multi-select' | 'text' | 'placeholder';
    exactMatch?: boolean;
    wrongAnswers?: string[];
    text?: string;
    hint?: boolean;
}