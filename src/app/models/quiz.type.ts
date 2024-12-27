export type Quiz = {
    id: number;
    active: boolean;
    subject: string;
    category: string;
    subTitle?: string;
    questionIds?: number[];
    questionIdsMap?: string;
    files: string;
    year: string;
    unit: string;
}