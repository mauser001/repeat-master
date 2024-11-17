import { Question } from "../models/question.type";

export function validateAnswers(question: Question, answers: string[]): boolean {
    const correctAnswers = question.correctAnswers.split('|');
    console.log('validate', correctAnswers, answers)
    return correctAnswers.every((value, index) => {
        if (question.exactMatch) {
            return value === answers[index]
        } else {
            return answers.find(a => a.toUpperCase() === value.toUpperCase())
        }
    });
}