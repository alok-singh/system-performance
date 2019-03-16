interface SizeStore {
	nodeHeight: number;
	nodeWidth: number;
	strokeWidth: number;
	borderRadius: number;
	circleRadius: number;
	triggerHeight: number;
	triggerWidth: number;
	distanceA: number;
	distanceB: number;
	distanceC: number;
}

export const nodeSizes: SizeStore = {
	nodeHeight: 110,
	nodeWidth: 205,
	triggerHeight: 100,
	triggerWidth: 200,
	strokeWidth: 3,
	borderRadius: 5,
	circleRadius: 5,
	distanceA: 10,	
	distanceB: 20,
	distanceC: 10
};