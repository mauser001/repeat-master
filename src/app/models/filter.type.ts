import { Quiz } from "./quiz.type";

export const FilterKeys = ['unit', 'year', 'subject', 'category'] as const;
export type FilterKey = typeof FilterKeys[number];

type PickKeys<T, K extends keyof T> = {
    [P in K]: T[P][];
};

export type Filter = PickKeys<Quiz, FilterKey>;

export const newFilter = (): Filter => ({ category: [], subject: [], unit: [], year: [] })

