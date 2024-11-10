import { random } from 'lodash-es'

export function randomizeList<T>(list: T[]): T[] {
    const newList = [...list];
    const len = newList.length
    for (let i = 0; i < len; i++) {
        const item = newList.splice(i, 1)[0];
        newList.splice(random(len - 1), 0, item)
    }
    return newList;
}