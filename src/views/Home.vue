<template>
	<v-header />
	<v-sidebar />
	<div class="content-box" :class="{ 'content-collapse': sidebar.collapse }">
		<div class="content">
			<router-view v-slot="{ Component }">
				<transition name="move" mode="out-in">
					<!-- <keep-alive> -->
						<component :is="Component"></component>
					<!-- </keep-alive> -->
				</transition>
			</router-view>
		</div>
	</div>
</template>
<script setup>
import { useSidebarStore } from '../stores/sidebar';
import vHeader from '../components/header.vue';
import vSidebar from '../components/sidebar.vue';
const sidebar = useSidebarStore();
</script>
