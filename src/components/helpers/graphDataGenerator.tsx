const getRandomNumber = (start: number, end: number) => {
	return  Math.round(100*start + 100*(Math.random()*end))/100;
}

const getDataList = (size) => {
	let data = [];
	while(size--){
		data.push(getRandomNumber(0, 100));
	}
	return data;
}

export const getGraphData = () => {
	return  [
		['Server 1'].concat(getDataList(50)),
		['Server 2'].concat(getDataList(50)),
		['Server 3'].concat(getDataList(50)),
		['Server 4'].concat(getDataList(50))
	]
}