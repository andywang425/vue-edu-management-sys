<template>
    <el-menu class="sidebar-el-menu sidebar" :default-active="onRoutes" :collapse="sidebar.collapse"
        background-color="#324157" text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
        <template v-for="item in items">
            <template v-if="item.subs">
                <el-sub-menu :index="item.index" :key="item.index" v-roles="item.roles">
                    <template #title>
                        <el-icon>
                            <component :is="item.icon"></component>
                        </el-icon>
                        <span>{{ item.title }}</span>
                    </template>
                    <template v-for="subItem in item.subs">
                        <el-sub-menu v-if="subItem.subs" :index="subItem.index" :key="subItem.index" v-roles="item.roles">
                            <template #title>{{ subItem.title }}</template>
                            <el-menu-item v-for="(threeItem, i) in subItem.subs" :key="i" :index="threeItem.index">
                                {{ threeItem.title }}
                            </el-menu-item>
                        </el-sub-menu>
                        <el-menu-item v-else :index="subItem.index" v-roles="item.roles">
                            {{ subItem.title }}
                        </el-menu-item>
                    </template>
                </el-sub-menu>
            </template>
            <template v-else>
                <el-menu-item :index="item.index" :key="item.index" v-roles="item.roles">
                    <el-icon>
                        <component :is="item.icon"></component>
                    </el-icon>
                    <template #title>{{ item.title }}</template>
                </el-menu-item>
            </template>
        </template>
    </el-menu>
</template>

<script setup>
import { computed } from 'vue';
import { useSidebarStore } from '../stores/sidebar';
import { useRoute } from 'vue-router';

const items = [
    {
        icon: 'Odometer',
        index: '/',
        title: '系统首页'
    },
    {
        icon: 'Edit',
        index: '信息管理',
        title: '信息管理',
        roles: [3],
        subs: [
            {
                index: '/college_management',
                title: '学院信息管理',
                roles: [3],
            },
            {
                index: '/major_management',
                title: '专业信息管理',
                roles: [3],
            },
            {
                index: '/class_management',
                title: '班级信息管理',
                roles: [3],
            },
            {
                index: '/student_management',
                title: '在籍学生管理',
                roles: [3],
            },
            {
                index: '/teacher_management',
                title: '教师信息管理',
                roles: [3],
            },
            {
                index: '/course_management',
                title: '课程信息管理',
                roles: [3],
            }
        ],
    },
    {
        icon: 'Upload',
        index: '批量信息导入',
        title: '批量信息导入',
        roles: [3],
        subs: [
            {
                index: '/import_classes',
                title: '导入班级信息',
                roles: [3],
            },
            {
                index: '/import_students',
                title: '导入学生信息',
                roles: [3],
            }
        ],
    },
    {
        icon: 'DocumentCopy',
        index: '/course_plan',
        title: '课程计划',
        roles: [3]
    },
    {
        icon: 'DataBoard',
        index: '/teach_management',
        title: '授课管理',
        roles: [3]
    },
    {
        icon: 'Search',
        index: '信息查询',
        title: '信息查询',
        roles: [3],
        subs: [
            {
                index: '/student_search',
                title: '学生信息查询',
                roles: [3]
            },
            {
                index: '/teacher_search',
                title: '教师信息查询',
                roles: [3]
            },
            {
                index: '/course_search',
                title: '课程信息查询',
                roles: [3]
            },
            {
                index: '/teach_search',
                title: '教师授课查询',
                roles: [3]
            }
            ,
            {
                index: '/elective_search',
                title: '学生选课查询',
                roles: [3]
            }
        ],
    },
    {
        icon: 'Calendar',
        index: '报表统计',
        title: '报表统计',
        roles: [3],
        subs: [
            {
                index: '/student_elective_statement',
                title: '学生选课报表',
                roles: [3]
            },
            {
                index: '/teacher_teach_statement',
                title: '教师授课报表',
                roles: [3]
            },
            {
                index: '/class_gpa_statement',
                title: '班级绩点报表',
                roles: [3]
            },
            {
                index: '/teacher_title_statement',
                title: '教师职称报表',
                roles: [3]
            },
            {
                index: '/college_course_statement',
                title: '学院课程报表',
                roles: [3]
            },
            {
                index: '/teacher_course_statement',
                title: '授课学时报表',
                roles: [3]
            }
        ],
    },
    {
        icon: 'Calendar',
        index: '/elective_course',
        title: '选课',
        roles: [1]
    },
    {
        icon: 'Document',
        index: '/my_courses',
        title: '已选课程',
        roles: [1]
    },
    {
        icon: 'Upload',
        index: '/import_student_scores',
        title: '批量录入成绩',
        roles: [2]
    },
    {
        icon: 'Search',
        index: '/student_score',
        title: '学生成绩查询',
        roles: [2]
    },
    {
        icon: 'Document',
        index: '/student_elective_info',
        title: '学生选课信息',
        roles: [2]
    }
];

const route = useRoute();
const onRoutes = computed(() => {
    return route.path;
});

const sidebar = useSidebarStore();
</script>

<style scoped>
.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: scroll;
}

.sidebar::-webkit-scrollbar {
    width: 0;
}

.sidebar-el-menu:not(.el-menu--collapse) {
    width: 250px;
}

.sidebar>ul {
    height: 100%;
}
</style>
