<template>
	<el-dropdown trigger="click" :teleported="false">
		<el-button size="small" type="primary">
			<span>更多</span>
			<el-icon class="el-icon--right"><arrow-down /></el-icon>
		</el-button>
		<template #dropdown>
			<el-dropdown-menu>
				<el-dropdown-item @click="refresh()">
					<el-icon><Refresh /></el-icon>刷新
				</el-dropdown-item>
				<el-dropdown-item @click="maximize">
					<el-icon><FullScreen /></el-icon>最大化
				</el-dropdown-item>
				<el-dropdown-item divided @click="closeCurrentTab()">
					<el-icon><Remove /></el-icon>关闭当前
				</el-dropdown-item>
				<el-dropdown-item @click="closeOtherTab">
					<el-icon><CircleClose /></el-icon>关闭其他
				</el-dropdown-item>
				<el-dropdown-item @click="closeAllTab">
					<el-icon><FolderDelete /></el-icon>关闭全部
				</el-dropdown-item>
			</el-dropdown-menu>
		</template>
	</el-dropdown>
</template>

<script setup lang="ts">
import { useAppStore } from "@/store/app";
import { useTabFunction } from './useTabFunction'

const appStore = useAppStore();

const {
	refresh,
	closeCurrentTab,
	closeOtherTab,
	closeAllTab
} = useTabFunction()

// maximize current page
const maximize = () => {
	appStore.maximize = true;
};

</script>

<style scoped lang="scss">
</style>
