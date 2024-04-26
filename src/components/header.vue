<template>
	<div class="header">
		<!-- 折叠按钮 -->
		<div class="collapse-btn" @click="sidebar.toggleCollapse()">
			<el-icon v-if="sidebar.collapse">
				<Expand />
			</el-icon>
			<el-icon v-else>
				<Fold />
			</el-icon>
		</div>
		<div class="logo">教务管理系统</div>
		<div class="header-right">
			<div class="header-date">
				{{ currentDateTime }}
			</div>
			<div class="header-user-con">
				<!-- 用户头像 -->
				<el-avatar class="user-avator" :size="30" :src="photoUrl" />
				<!-- 用户名下拉菜单 -->
				<el-dropdown class="user-name" trigger="click" @command="handleCommand">
					<span class="el-dropdown-link">
						{{ username }}
						<el-icon class="el-icon--right">
							<arrow-down />
						</el-icon>
					</span>
					<template #dropdown>
						<el-dropdown-menu>
							<el-dropdown-item command="modPassword">修改密码</el-dropdown-item>
							<el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
						</el-dropdown-menu>
					</template>
				</el-dropdown>
			</div>
		</div>
	</div>
	<el-dialog title="修改密码" v-model="modifyPasswordVisible" width="30%">
		<el-form label-width="70px">
			<el-form-item label="原密码">
				<el-input type="password" v-model="form.old_password"></el-input>
			</el-form-item>
			<el-form-item label="新密码">
				<el-input type="password" v-model="form.new_password"></el-input>
			</el-form-item>
			<el-form-item label="确认密码">
				<el-input type="password" v-model="confirm_password"></el-input>
			</el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="modifyPasswordVisible = false">取 消</el-button>
				<el-button type="primary" @click="savePassword">确 定</el-button>
			</span>
		</template>
	</el-dialog>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount, reactive } from 'vue';
import { userInfoStore } from '../stores/userinfo';
import { useSidebarStore } from '../stores/sidebar';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import API from '../utils/api'
import photoUrl from '../assets/img/photo.jpg';

const localTimeString = () => {
	const now = new Date();
	let year = now.getFullYear();
	let month = now.getMonth() + 1;
	let day = now.getDate();
	let hours = now.getHours();
	let minutes = now.getMinutes();

	day = day < 10 ? '0' + day : day;
	hours = hours < 10 ? '0' + hours : hours;
	minutes = minutes < 10 ? '0' + minutes : minutes;
	return `${year}/${month}/${day} ${hours}:${minutes}`;
}

const currentDateTime = ref(localTimeString());

let intervalId;

onMounted(() => {
	intervalId = setInterval(() => {
		currentDateTime.value = localTimeString();
	}, 1000);
});

onBeforeUnmount(() => {
	clearInterval(intervalId);
});

const userInfo = userInfoStore();

const username = userInfo.username;

const sidebar = useSidebarStore();

onMounted(() => {
	if (document.body.clientWidth < 1500) {
		sidebar.toggleCollapse();
	}
});

const form = reactive({
	old_password: '',
	new_password: ''
});
const confirm_password = ref('');
let modifyPasswordVisible = ref(false);
// 用户名下拉菜单选择事件
const router = useRouter();
const handleCommand = (command) => {
	if (command == 'logout') {
		API.logout().then(res => {
			localStorage.removeItem('username');
			localStorage.removeItem('role');
			router.push('/login');
		}).catch(e => {
			console.error('退出登录失败', e)
		})
	} else {
		modifyPasswordVisible.value = true;
	}
};
const savePassword = () => {
	if (!validateInput(form.old_password, form.new_password, confirm_password.value))
		return;
	API.modPassword(form).then(res => {
		if (res.code === 0) {
			modifyPasswordVisible.value = false;
			ElMessage.success('修改密码成功，请重新登录');
			localStorage.removeItem('username');
			localStorage.removeItem('role');
			router.push('/login');
		} else if (res.code === 1) {
			ElMessage.error(res.msg);
		} else {
			ElMessage.error('修改密码失败')
		}
	})
};
const validateInput = (old_password, new_password, confirm_password) => {
	if (!old_password) {
		ElMessage.warning('原密码不能为空');
		return false;
	}
	if (!new_password) {
		ElMessage.warning('新密码不能为空');
		return false;
	}
	if (new_password != confirm_password) {
		ElMessage.warning('两次密码输入不一致');
		return false;
	}
	return true;
}
</script>
<style scoped>
.header {
	position: relative;
	box-sizing: border-box;
	width: 100%;
	height: 70px;
	font-size: 20px;
	color: #fff;
}

.collapse-btn {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
	float: left;
	padding: 0 21px;
	cursor: pointer;
}

.header .logo {
	float: left;
	width: 250px;
	line-height: 70px;
}

.header-right {
	float: right;
	padding-right: 50px;
}

.header-date {
	display: flex;
	align-items: center;
	height: 70px;
	float: left;
	font-size: 21px;
}

.header-user-con {
	display: flex;
	height: 70px;
	align-items: center;
}

.btn-fullscreen {
	transform: rotate(45deg);
	margin-right: 5px;
	font-size: 24px;
}

.btn-bell,
.btn-fullscreen {
	position: relative;
	width: 30px;
	height: 30px;
	text-align: center;
	border-radius: 15px;
	cursor: pointer;
	display: flex;
	align-items: center;
}

.btn-bell-badge {
	position: absolute;
	right: 4px;
	top: 0px;
	width: 8px;
	height: 8px;
	border-radius: 4px;
	background: #f56c6c;
	color: #fff;
}

.btn-bell .el-icon-lx-notice {
	color: #fff;
}

.user-name {
	margin-left: 10px;
}

.user-avator {
	margin-left: 20px;
}

.el-dropdown-link {
	color: #fff;
	cursor: pointer;
	display: flex;
	align-items: center;
}

.el-dropdown-menu__item {
	text-align: center;
}
</style>
