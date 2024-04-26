<template>
	<div class="login-wrap">
		<div class="ms-login">
			<div class="ms-title">教务管理系统</div>
			<el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
				<el-form-item prop="username">
					<el-input v-model="param.username" placeholder="用户名">
						<template #prepend>
							<el-icon>
								<User />
							</el-icon>
						</template>
					</el-input>
				</el-form-item>
				<el-form-item prop="password">
					<el-input type="password" placeholder="密码" v-model="param.password" @keyup.enter="submitForm(login)">
						<template #prepend>
							<el-icon>
								<Lock />
							</el-icon>
						</template>
					</el-input>
				</el-form-item>
				<div class="login-btn">
					<el-button type="primary" @click="submitForm(login)">登录</el-button>
				</div>
				<p class="login-tips">Tips : 默认用户名和密码为学号或工号。</p>
			</el-form>
		</div>
	</div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { userInfoStore } from '../stores/userinfo';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { Lock, User } from '@element-plus/icons-vue';
import API from '../utils/api'

const router = useRouter();

const param = reactive({
	username: '',
	password: '',
});

const rules = {
	username: [
		{
			required: true,
			message: '请输入用户名',
			trigger: 'blur'
		}
	],
	password: [
		{
			required: true,
			message: '请输入密码',
			trigger: 'blur'
		}
	]
};
const userInfo = userInfoStore();
const login = ref();
const submitForm = (formEl) => {
	if (!formEl) return;
	formEl.validate(async (valid) => {
		if (valid) {
			const result = await API.login(param);
			if (result.code === 0) {
				ElMessage.success('登录成功');
				userInfo.username = param.username;
				userInfo.role = result.role;
				localStorage.setItem('role', userInfo.role);
				localStorage.setItem('username', userInfo.username);
				router.push('/');
			} else {
				ElMessage.error('账号或密码错误');
			}
		} else {
			return false;
		}
	});
};
</script>

<style scoped>
.login-wrap {
	position: relative;
	width: 100%;
	height: 100%;
	background-image: url(../assets/img/login-bg3.jpg);
	background-size: 100%;
}

.ms-title {
	width: 100%;
	line-height: 50px;
	text-align: center;
	font-size: 20px;
	color: #fff;
	border-bottom: 1px solid #ddd;
}

.ms-login {
	position: absolute;
	left: 50%;
	top: 50%;
	width: 350px;
	margin: -190px 0 0 -175px;
	border-radius: 5px;
	background: rgba(31, 60, 77, 0.4);
	overflow: hidden;
}

.ms-content {
	padding: 30px 30px;
}

.login-btn {
	text-align: center;
}

.login-btn button {
	width: 100%;
	height: 36px;
	margin-bottom: 10px;
}

.login-tips {
	font-size: 12px;
	line-height: 30px;
	color: #fff;
}
</style>
