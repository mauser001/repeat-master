export type Quiz = {
    id: number;
    active: boolean;
    title: string;
    category: string;
    description?: string;
    questionIds: number[];
}