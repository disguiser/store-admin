import { defineStore } from "pinia";
import router from "@/router/index";

/* tabsMenuProps */
export interface TabsMenuProps {
	icon: string;
	title: string;
	path: string;
	name: string;
	closeable: boolean;
}

/* TabsState */
export interface TabsState {
	tabsMenuList: TabsMenuProps[];
}

// TabsStore
export const useTabsStore = defineStore({
	id: "Tabs",
	state: (): TabsState => ({
		tabsMenuList: []
	}),
	actions: {
		// Add Tabs
		async addTabs(tabItem: TabsMenuProps) {
			if (this.tabsMenuList.every(item => item.path !== tabItem.path)) {
				this.tabsMenuList.push(tabItem);
			}
		},
		// Remove Tabs
		async removeTabs(tabPath: string, isCurrent: boolean = true) {
			const tabsMenuList = this.tabsMenuList;
			if (isCurrent) {
				tabsMenuList.forEach((item, index) => {
					if (item.path !== tabPath) return;
					const nextTab = tabsMenuList[index + 1] || tabsMenuList[index - 1];
					if (!nextTab) return;
					router.push(nextTab.path);
				});
			}
			this.tabsMenuList = tabsMenuList.filter(item => item.path !== tabPath);
		},
		// Close MultipleTab
		async closeMultipleTab(tabsMenuValue?: string) {
			this.tabsMenuList = this.tabsMenuList.filter(item => {
				return item.path === tabsMenuValue || item.closeable === false;
			});
		},
		// Set Tabs
		// async setTabs(tabsMenuList: TabsMenuProps[]) {
		// 	this.tabsMenuList = tabsMenuList;
		// },
		// Set Tabs Title
		async setTabsTitle(title: string) {
			const nowFullPath = location.hash.substring(1);
			this.tabsMenuList.forEach(item => {
				if (item.path == nowFullPath) item.title = title;
			});
		}
	},
	persist: false
});
