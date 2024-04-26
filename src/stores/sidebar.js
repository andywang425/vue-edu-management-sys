import { defineStore } from 'pinia';

export const useSidebarStore = defineStore('sidebar', {
	state: () => {
		return {
			collapse: false
		};
	},
	actions: {
		toggleCollapse() {
			this.collapse = !this.collapse;
		}
	}
});
