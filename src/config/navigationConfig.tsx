interface navigationItem {
	title: string;
	initialActive: boolean;
	iconClass: string;
	href: string;
}

interface navigationItemSetup extends navigationItem {
    isDisabled: boolean;
}

const setupNavList: Array<navigationItemSetup> = [
    {
        // title: "Source Configurations",
        title: "Back",
        initialActive: false,
        iconClass: "fa fa-angle-left",
        href: "back",
        isDisabled: false
    }, {
        // title: "Source Configurations",
        title: "Step 4",
        initialActive: false,
        iconClass: "fa fa-github-square",
        href: "/form-setup/source-config",
        isDisabled: false
    }, {
        // title: "CI Configurations",
        title: "Step 5",
        initialActive: false,
        iconClass: "fa fa-github-square",
        href: "/form-setup/ci-config",
        isDisabled: false
    }, {
        // title: "Deployment Template",
        title: "Step 6",
        initialActive: false,
        iconClass: "fa fa-github-square",
        href: "/form-setup/deployment-template",
        isDisabled: false
    }, {
        // title: "Deployment Template",
        title: "Step 7",
        initialActive: false,
        iconClass: "fa fa-github-square",
        href: "/form-setup/properties-config",
        isDisabled: false
    }, {
        // title: "Flow Chart",
        // it contains environment specific configuration
        // it contains deployment template selection on pipeline
        title: "Step 8",
        initialActive: true,
        iconClass: "fa fa-dashboard",
        href: "/form-setup/flow-chart",
        isDisabled: false
    }

];

const homeNavList: Array<navigationItem> = [
    {
        title: "Setup",
        initialActive: false,
        iconClass: "fa fa-server",
        href: "/form-setup/source-config"
    }, {
        title: "Global Config",
        initialActive: false,
        iconClass: "fa fa-globe",
        href: "/form-global/git-repo-config"
    }, {
        title: "App List",
        initialActive: false,
        iconClass: "fa fa-modx",
        href: "/list/apps"
    }, {
        title: "Git Repository List",
        initialActive: false,
        iconClass: "fa fa-github-square",
        href: "/list/git-repos"
    }, {
        title: "Docker Registries",
        initialActive: false,
        iconClass: "fa fa-book",
        href: "/list/docker-registries"
    }, {
        title: "Graphs",
        initialActive: false,
        iconClass: "fa fa-area-chart",
        href: "/details/graphs"
    }
];

const globalConfigNavList: Array<navigationItemSetup> = [
    {
        // title: "Source Configurations",
        title: "Back",
        initialActive: false,
        iconClass: "fa fa-angle-left",
        href: "back",
        isDisabled: false
    }, {
        title: "Git Repo Config",
        initialActive: false,
        iconClass: "fa fa-github-square",
        href: "/form-global/git-repo-config",
        isDisabled: false
    }, {
        title: "Environment Config",
        initialActive: false,
        iconClass: "fa fa-envira",
        href: "/form-global/environment-register",
        isDisabled: false
    }, {
        title: "Docker Config",
        initialActive: false,
        iconClass: "fa fa-file",
        href: "/form-global/docker-register",
        isDisabled: false
    }
]

export const navigationListProvider = (url: string, pathName: string): Array<navigationItem> => {
    let list = homeNavList;
    if(url.indexOf('form-setup') !== -1) {
        list = setupNavList;
    }
    else if(url.indexOf('form-global') !== -1) {
        list = globalConfigNavList;
    }
    return list.map(navItem => {
        if(pathName == navItem.href){
            navItem.initialActive = true;
        }
        else{
            navItem.initialActive = false;
        }
        return navItem;
    });
} 


/*{
    title: "Create Docker",
    initialActive: false,
    iconClass: "fa fa-file-text",
    href: "/create-docker"
},*/ 