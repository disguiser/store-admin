<template>
	<div class="tabs-box">
		<div class="tabs-menu">
			<el-tabs v-model="tabsMenuValue" type="card" @tab-click="tabClick" @tab-remove="tabRemove">
				<el-tab-pane
					v-for="item in tabsMenuList"
					:key="item.path"
					:label="item.title"
					:name="item.path"
					:closable="item.closeable !== false"
				>
					<template #label>
						<div class="tab-label" @contextmenu.prevent="openMenu(item, $event)">
							<el-icon class="tabs-icon" v-show="item.icon">
								<!-- <component :is="item.icon"></component> -->
								<Icon :icon="item.icon" />
							</el-icon>
							{{ item.title }}
						</div>
					</template>
				</el-tab-pane>
			</el-tabs>
			<MoreButton />
			<RightClickMenu ref="rightClickMenuEl" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useTabsStore } from '@/store/tabs';
import { useAuthStore } from "@/store/auth";
import { useKeepAliveStore } from "@/store/keepAlive";
import { TabPaneName, TabsPaneContext } from "element-plus";
import { Icon } from '@iconify/vue';
import MoreButton from "./components/MoreButton.vue";
import RightClickMenu from './components/RightClickMenu.vue';

const route = useRoute();
const router = useRouter();
const tabStore = useTabsStore();
const authStore = useAuthStore();
const keepAliveStore = useKeepAliveStore();

const tabsMenuValue = ref(route.fullPath);
const tabsMenuList = computed(() => tabStore.tabsMenuList);

// 初始化需要固定的标签
const initTabs = () => {
	authStore.flatMenuListGet.forEach(item => {
		if (item.meta.closeable === false && !item.meta.isHide && !item.meta.isFull) {
			const tabsParams = {
				icon: item.meta.icon,
				title: item.meta.title,
				path: item.path,
				name: item.name,
				closeable: item.meta.closeable
			};
			tabStore.addTabs(tabsParams);
		}
	});
};

initTabs();

// 监听路由的变化（防止浏览器后退/前进不变化 tabsMenuValue）
watch(
	() => route.fullPath,
	() => {
		if (route.meta.isFull) return;
		tabsMenuValue.value = route.fullPath;
		const tabsParams = {
			icon: route.meta.icon as string,
			title: route.meta.title as string,
			path: route.fullPath,
			name: route.name as string,
			closeable: route.meta.closable as boolean
		};
		tabStore.addTabs(tabsParams);
		route.meta.isKeepAlive !== false && keepAliveStore.addKeepAliveName(route.name as string);
	},
	{
		immediate: true
	}
);

// Tab Click
const tabClick = (tabItem: TabsPaneContext) => {
	const fullPath = tabItem.props.name as string;
	router.push(fullPath);
};

// Remove Tab
const tabRemove = (fullPath: TabPaneName) => {
	const name = tabStore.tabsMenuList.filter(item => item.path == fullPath)[0].name || "";
	keepAliveStore.removeKeepAliveName(name);
	tabStore.removeTabs(fullPath as string, fullPath == route.fullPath);
};

const rightClickMenuEl = ref()
function openMenu(item: any, e: MouseEvent) {
	rightClickMenuEl.value.left = e.clientX
	rightClickMenuEl.value.top = e.clientY
	rightClickMenuEl.value.visible = true
	rightClickMenuEl.value.selectedRoute = item
}
</script>

<style scoped lang="scss">
.tabs-box {
	:deep(.tabs-menu) {
		position: relative;
		width: 100%;
		.el-dropdown {
			position: absolute;
			top: 8px;
			right: 13px;
		}
		.tab-label {
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.tabs-icon {
			// top: 2px;
			right: 5px;
			font-size: 15px;
		}
		.el-tabs__nav-wrap {
			position: absolute;
			width: calc(100% - 110px);
		}
		.el-tabs--card > .el-tabs__header {
			box-sizing: border-box;
			height: 40px;
			padding: 0 10px;
			margin: 0;
		}
		.el-tabs--card > .el-tabs__header .el-tabs__nav {
			border: none;
		}
		.el-tabs--card > .el-tabs__header .el-tabs__item {
			color: #cccccc;
			border: none;
		}
		.el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
			color: var(--el-color-primary);
			border-bottom: 2px solid var(--el-color-primary);
		}
		.el-tabs__item .is-icon-close svg {
			margin-top: 0.5px;
		}
	}
}
</style>
