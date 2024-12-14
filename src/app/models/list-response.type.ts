import { Quiz } from "./quiz.type";

export type ListResponse = {
    version: number;
    quizes: Quiz[]
}