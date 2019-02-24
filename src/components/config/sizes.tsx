interface SizeStore {
	nodeHeight: number;
	nodeWidth: number;
	strokeWidth: number;
	borderRadius: number;
	circleRadius: number;
	distanceA: number;
	distanceB: number;
	distanceC: number;
}

export const nodeSizes: SizeStore = {
	nodeHeight: 50*1.2,
	nodeWidth: 120*1.2,
	strokeWidth: 2,
	borderRadius: 5,
	circleRadius: 5,
	distanceA: 10,	
	distanceB: 20,
	distanceC: 10
};