interface navigationItem {
    title: string;
	iconClass: string;
    isCollapsed?: boolean;
    isActive?: boolean;
	href?: string;
    subItems?: navigationItem[]
}

const navigationList: navigationItem[] = [{
    title: 'Dashboard',
    iconClass: 'fa fa-dashboard',
    subItems: [{
        title: 'Git Repository List',
        iconClass: 'fa fa-github-square',
        href: '/list/git-repos'
    }, {
        title: 'Docker Registries',
        iconClass: 'fa fa-book',
        href: '/list/docker-registries'
    }, {
        title: 'Graphs',
        iconClass: 'fa fa-area-chart',
        href: '/details/graphs'
    }, {
        title: "App List",
        iconClass: "fa fa-modx",
        href: "/list/apps"
    }]
}, {
    title: 'Global Config',
    iconClass: 'fa fa-globe',
    subItems: [{
        title: 'Git Repo Config',
        iconClass: 'fa fa-globe',
        href: '/form-global/git-repo-config'
    }, {
        title: 'Environment Config',
        iconClass: 'fa fa-envira',
        href: '/form-global/environment-register'
    }, {
        title: 'Docker Config',
        iconClass: 'fa fa-file',
        href: '/form-global/docker-register'
    }]
}, {
    title: 'Setup',
    iconClass: 'fa fa-server',
    href: '/form-setup/source-config'
}];

export const navigationListProvider = (pathName: string) => {
    return navigationList.map(menuItem => {
        menuItem.subItems = menuItem.subItems ? menuItem.subItems.map(subItem => {
            subItem.isActive = false;
            return subItem;
        }) : undefined;
        return menuItem;
    }).map(menuItem => {
        if(menuItem.subItems){
            let activeSubMenu = menuItem.subItems.find(subMenu => pathName == subMenu.href);
            if(activeSubMenu) {
                activeSubMenu.isActive = true;
                menuItem.isCollapsed = false;
            }
            else{
                menuItem.isCollapsed = true;
            }
        }
        return menuItem;
    });
} 


/*{
    title: 'Create Docker',
    isActive: false,
    iconClass: 'fa fa-file-text',
    href: '/create-docker'
},*/ 