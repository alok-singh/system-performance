export const generateNode = () => {
	return {
		id: `S${(new Date()).getTime().toString(36)}`,
		command: ''
	}
}