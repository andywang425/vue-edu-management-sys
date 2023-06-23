<template>
  <div class="container">
    <div>
      <h1>欢迎使用教务管理系统</h1>
      <div class="hello">
        <div v-if="role === 1">
          <p>尊敬的学生，您好！
          </p>
        </div>
        <div v-else-if="role === 2">
          <p>尊敬的教师，您好！
          </p>
        </div>
        <div v-else-if="role === 3">
          <p>尊敬的教务管理人员，您好！</p>
        </div>
        <div v-else-if="role === 4">
          <p>尊敬的毕业校友，您好！</p>
        </div>
        <div v-else>
          <p>未知身份</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { userInfoStore } from '../stores/userinfo';

let userInfo = userInfoStore();
let role = userInfo.role;
</script>

<style scoped>
.hello {
  padding: 20px 0px;
}
</style>
