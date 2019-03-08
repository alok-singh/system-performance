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
}, {
    title: "Graphs",
    initialActive: false,
    iconClass: "fa fa-area-chart",
    href: "/graphs"
}, {
    title: "App List",
    initialActive: false,
    iconClass: "fa fa-github-square",
    href: "/list/apps"
}, {
    title: "Docker Registries",
    initialActive: false,
    iconClass: "fa fa-github-square",
    href: "/list/docker-registries"
}, {
    title: "Docker Registration",
    initialActive: false,
    iconClass: "fa fa-github-square",
    href: "/form/docker-register"
}, {
    title: "CI Configurations",
    initialActive: false,
    iconClass: "fa fa-github-square",
    href: "/form/ci-config"
}, {
    title: "Source Configurations",
    initialActive: false,
    iconClass: "fa fa-github-square",
    href: "/form/source-config"
}, {
    title: "Deployment Template",
    initialActive: false,
    iconClass: "fa fa-github-square",
    href: "/form/deployment-template"
}, {
    title: "Git Repository Configuration",
    initialActive: false,
    iconClass: "fa fa-github-square",
    href: "/form/git-repo-config"
}, {
    title: "Git Repository List",
    initialActive: false,
    iconClass: "fa fa-github-square",
    href: "/list/git-repos"
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