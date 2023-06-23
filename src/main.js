// import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { userInfoStore } from './stores/userinfo';
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import './assets/css/icon.css';

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.use(ElementPlus)

// 注册ElementPlus的所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

// 自定义指令 roles，管理侧边栏角色权限
const userInfo = userInfoStore();
app.directive('roles', {
    mounted(el, binding) {
        if (binding.value && !binding.value.includes(userInfo.role)) {
            el['hidden'] = true;
        }
    },
});

app.mount('#app')
