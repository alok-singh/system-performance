export interface gitRepositoriesType {
	authMode: string;
	id: string;
	name: string;
	password: string;
	url: string;
	userName: string;
}

export const dummyData = [{
	authMode: "USERNAME_PASSWORD",
	id: "1",
	name: "abc-git-1",
	password: "demo password",
	url: "https://git-abc-1.com",
	userName: "demoUser"
},{
	authMode: "USERNAME_PASSWORD",
	id: "1",
	name: "abc-git-1",
	password: "demo password",
	url: "https://git-abc-1.com",
	userName: "demoUser"
},{
	authMode: "USERNAME_PASSWORD",
	id: "1",
	name: "abc-git-1",
	password: "demo password",
	url: "https://git-abc-1.com",
	userName: "demoUser"
},{
	authMode: "USERNAME_PASSWORD",
	id: "1",
	name: "abc-git-1",
	password: "demo password",
	url: "https://git-abc-1.com",
	userName: "demoUser"
}]

export const gitRepositoryParse = (repositories) => {
	if(repositories.length) {
		return repositories.map(repository => {
			return {
				authMode: repository.authMode,
				id: repository.id,
				name: repository.name,
				url: repository.url,
				userName: repository.userName
			}
		})
	}
	else { 
		return [];
	}
}