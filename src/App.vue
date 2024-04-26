<template>
  <el-config-provider :locale="zhCn">
    <router-view />
  </el-config-provider>
</template>

<script setup>
import { ElConfigProvider } from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import { onMounted } from 'vue'
import API from './utils/api'
import { useRouter } from 'vue-router';
import { route_jump } from './utils/common'

const router = useRouter();
onMounted(async () => {
  route_jump(router, await API.check())
})
</script>
<style>
@import './assets/css/main.css';
@import './assets/css/color-dark.css';
</style>
