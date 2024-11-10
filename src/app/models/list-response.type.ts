import { Question } from "./question.type";
import { Quiz } from "./quiz.type";

export type ListResponse = {
    quizes: Quiz[],
    questions: Question[]
}