let cardPosition: Position | null = {x:0, y:0};
let selectedCard: string  = "nullxas1234asaaddsnull" //random id so that it doesnt clash with any id
let observers: PositionObserver[] = []

export type PositionObserver = ((id: string, position: Position) => void) | null
export interface Position {x:number, y: number}

const emitChange = () => observers.forEach(o => o && cardPosition && o(selectedCard, cardPosition))


export function observe(o: PositionObserver) {
	observers.push(o)
	emitChange()

	return () => {
		observers = observers.filter(t => t !== o)
	}
}

export function moveCard(id: string, to: Position) {
    cardPosition = to
    selectedCard = id
    emitChange()
}