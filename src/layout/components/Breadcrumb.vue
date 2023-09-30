<template>
	<div :class="['breadcrumb-box']">
		<el-breadcrumb :separator-icon="ArrowRight">
			<transition-group name="breadcrumb" mode="out-in">
				<el-breadcrumb-item v-for="item in breadcrumbList" :key="item">
					<div class="el-breadcrumb__inner">
						<!-- <el-icon class="breadcrumb-icon" v-show="item.meta.icon">
							<component :is="item.meta.icon"></component>
						</el-icon> -->
						<span class="breadcrumb-title">{{ item }}</span>
					</div>
				</el-breadcrumb-item>
			</transition-group>
		</el-breadcrumb>
	</div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useAuthStore } from "@/store/auth";
import { ArrowRight } from "@element-plus/icons-vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const breadcrumbList = computed(() => {
	let breadcrumbData: string[] = [];
	let a = authStore.breadcrumbListGet
	for (let i = 1; i < route.matched.length; i++) {
		a = a[route.matched[i].path]
		breadcrumbData.push(
			a.title
		)
	}
	// 🙅‍♀️不需要首页面包屑可删除以下判断
	// if (breadcrumbData[0].meta.title !== route.meta.title) {
	// 	breadcrumbData = [{ path: '/', meta: { icon: "HomeFilled", title: "首页" } }, ...breadcrumbData];
	// }
	return breadcrumbData;
});

</script>

<style scoped lang="scss">
.breadcrumb-box {
	display: flex;
	align-items: center;
	padding: 10px;
	overflow: hidden;
	// mask-image: linear-gradient(90deg, #000000 0%, #000000 calc(100% - 50px), transparent);
	.el-breadcrumb {
		white-space: nowrap;
		.el-breadcrumb__item {
			position: relative;
			display: inline-block;
			float: none;
			.el-breadcrumb__inner {
				display: inline-flex;
				.breadcrumb-icon {
					margin-top: 2px;
					margin-right: 6px;
					font-size: 16px;
				}
				.breadcrumb-title {
					margin-top: 3px;
				}
			}
			:deep(.el-breadcrumb__separator) {
				position: relative;
				top: -1px;
			}
		}
	}
}
.no-icon {
	.el-breadcrumb {
		.el-breadcrumb__item {
			top: -2px;
			:deep(.el-breadcrumb__separator) {
				top: 2px;
			}
		}
	}
}
</style>
