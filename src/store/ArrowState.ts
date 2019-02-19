import {Position} from '../behavior/vsm/MoveManager'

let start: Position | null = null
let end: Position | null = null

export const arrowStart = (initial: Position): void => {
    start = initial
}

export const arrowEnd = (final: Position): void => {
    end = final
}

export const getArrowStart = (): Position | null => {
    return start
}
export const getArrowEnd = (): Position | null => {
    return end
}
export const clearArrowState = (): void => {
    start = null
    end = null
}


