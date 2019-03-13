export interface DeploymentTemplateType {
	title: string;
	id: string;
	isActive: boolean;
}

export interface TriggerType {
	title: string;
	id: string;
	isActive: boolean;
}

export const DeploymentTemplateList: Array<DeploymentTemplateType> = [
	{
		title: 'Rolling',
		id: '1',
		isActive: true
	},{
		title: 'Blue Green',
		id: '2',
		isActive: false
	}
];

export const TriggerTypeList: Array<TriggerType> = [
	{
		title: 'Automated',
		id: '1',
		isActive: true
	},{
		title: 'Manual',
		id: '2',
		isActive: false
	}
];