interface navigationItem {
	title: string;
	initialActive: boolean;
	iconClass: string;
	href: string;
}

export const navigationItemList: Array<navigationItem>  = [{
    title: "Flow Chart",
    initialActive: true,
    iconClass: "fa fa-dashboard",
    href: "/flow-chart"
}, {
    title: "Create Docker",
    initialActive: false,
    iconClass: "fa fa-file-text",
    href: "/create-docker"
}]

export const navigationListProvider = (url: string): Array<navigationItem> => {
    return navigationItemList.map(navItem => {
        if(url == navItem.href){
            navItem.initialActive = true;
        }
        else{
            navItem.initialActive = false;
        }
        return navItem;
    });
} 