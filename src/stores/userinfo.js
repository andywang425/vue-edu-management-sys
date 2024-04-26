import { defineStore } from 'pinia';

export const userInfoStore = defineStore('userinfo', {
	state: () => {
		const role = Number(localStorage.getItem('role'));
		const username = localStorage.getItem('username');
		return {
			role: role,
			username: username
		};
	}
});

