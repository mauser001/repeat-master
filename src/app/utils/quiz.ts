import { Question } from "../models/question.type";

export function validateAnswers(question: Question, answers: string[]): boolean {
    return question.correctAnswers.every((value, index) => {
        if (question.exactMatch) {
            return value === answers[index]
        } else {
            return answers.find(a => a.toUpperCase() === value.toUpperCase())
        }
    });
}