import { createRouter, createWebHashHistory } from 'vue-router'
import { userInfoStore } from '../stores/userinfo';
import Home from '../views/Home.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    // {
    //   path: '/',
    //   redirect: { name: '首页' }
    // },
    {
      path: '/',
      name: 'Home',
      component: Home,
      children: [
        {
          path: '/',
          name: '首页',
          meta: {
            title: '首页'
          },
          component: () => import('../views/Welcome.vue'),
        },
        {
          path: '/college_management',
          name: 'college_management',
          meta: {
            title: '学院信息管理',
            roles: [3],
          },
          component: () => import('../views/CollegeManagement.vue'),
        },
        {
          path: '/major_management',
          name: 'major_management',
          meta: {
            title: '专业信息管理',
            roles: [3],
          },
          component: () => import('../views/MajorManagement.vue'),
        },
        {
          path: '/class_management',
          name: 'class_management',
          meta: {
            title: '班级信息管理',
            roles: [3],
          },
          component: () => import('../views/ClassManagement.vue'),
        },
        {
          path: '/student_management',
          name: 'student_management',
          meta: {
            title: '在籍学生管理',
            roles: [3],
          },
          component: () => import('../views/StudentManagement.vue'),
        },
        {
          path: '/teacher_management',
          name: 'teacher_management',
          meta: {
            title: '教师信息管理',
            roles: [3],
          },
          component: () => import('../views/TeacherManagement.vue'),
        },
        {
          path: '/course_management',
          name: 'course_management',
          meta: {
            title: '课程信息管理',
            roles: [3],
          },
          component: () => import('../views/CourseManagement.vue'),
        },
        {
          path: '/import_classes',
          name: 'import_classes',
          meta: {
            title: '导入班级信息',
            roles: [3],
          },
          component: () => import('../views/ImportClasses.vue'),
        },
        {
          path: '/import_students',
          name: 'import_students',
          meta: {
            title: '导入学生信息',
            roles: [3],
          },
          component: () => import('../views/ImportStudents.vue'),
        },
        {
          path: '/course_plan',
          name: 'course_plan',
          meta: {
            title: '课程计划',
            roles: [3],
          },
          component: () => import('../views/CoursePlan.vue'),
        },
        {
          path: '/teach_management',
          name: 'teach_management',
          meta: {
            title: '授课管理',
            roles: [3],
          },
          component: () => import('../views/TeachManagement.vue'),
        },
        {
          path: '/student_search',
          name: 'student_search',
          meta: {
            title: '学生信息查询',
            roles: [3],
          },
          component: () => import('../views/StudentInfoSearch.vue'),
        },
        {
          path: '/teacher_search',
          name: 'teacher_search',
          meta: {
            title: '教师信息查询',
            roles: [3],
          },
          component: () => import('../views/TeacherInfoSearch.vue'),
        },
        {
          path: '/course_search',
          name: 'course_search',
          meta: {
            title: '课程信息查询',
            roles: [3],
          },
          component: () => import('../views/CourseInfoSearch.vue'),
        },
        {
          path: '/teach_search',
          name: 'teach_search',
          meta: {
            title: '教师授课查询',
            roles: [3],
          },
          component: () => import('../views/TeachInfoSearch.vue'),
        },
        {
          path: '/elective_search',
          name: 'elective_search',
          meta: {
            title: '学生选课查询',
            roles: [3],
          },
          component: () => import('../views/ElectiveInfoSearch.vue'),
        },
        {
          path: '/student_elective_statement',
          name: 'student_elective_statement',
          meta: {
            title: '学生选课报表',
            roles: [3],
          },
          component: () => import('../views/StudentElectiveStatement.vue'),
        },
        {
          path: '/teacher_teach_statement',
          name: 'teacher_teach_statement',
          meta: {
            title: '教师授课报表',
            roles: [3],
          },
          component: () => import('../views/TeacherTeachStatement.vue'),
        },
        {
          path: '/class_gpa_statement',
          name: 'class_gpa_statement',
          meta: {
            title: '班级绩点报表',
            roles: [3],
          },
          component: () => import('../views/ClassGPAStatement.vue'),
        },
        {
          path: '/teacher_title_statement',
          name: 'teacher_title_statement',
          meta: {
            title: '教师职称报表',
            roles: [3],
          },
          component: () => import('../views/TeacherTitleStatement.vue'),
        },
        {
          path: '/college_course_statement',
          name: 'college_course_statement',
          meta: {
            title: '学院课程报表',
            roles: [3],
          },
          component: () => import('../views/CollegeCourseStatement.vue'),
        },
        {
          path: '/teacher_course_statement',
          name: 'teacher_course_statement',
          meta: {
            title: '授课学时报表',
            roles: [3],
          },
          component: () => import('../views/CourseHourStatement.vue'),
        },
        {
          path: '/elective_course',
          name: 'elective_course',
          meta: {
            title: '选课',
            roles: [1],
          },
          component: () => import('../views/ElectiveCourse.vue'),
        },
        {
          path: '/my_courses',
          name: 'my_courses',
          meta: {
            title: '已选课程',
            roles: [1],
          },
          component: () => import('../views/MyCourses.vue'),
        },
        {
          path: '/import_student_scores',
          name: 'import_student_scores',
          meta: {
            title: '批量录入成绩',
            roles: [2],
          },
          component: () => import('../views/ImportStudentScores.vue'),
        },
        {
          path: '/student_score',
          name: 'student_score',
          meta: {
            title: '学生成绩查询',
            roles: [2],
          },
          component: () => import('../views/StudentScore.vue'),
        },
        {
          path: '/student_elective_info',
          name: 'student_elective_info',
          meta: {
            title: '学生选课信息',
            roles: [2],
          },
          component: () => import('../views/StudentElectiveInfo.vue'),
        }
      ],
    },
    {
      path: '/login',
      name: '登录',
      meta: {
        title: '登录'
      },
      component: () => import('../views/Login.vue')
    },
    {
      path: '/403',
      name: '403',
      meta: {
        title: 'Access denied',
      },
      component: () => import('../views/403.vue'),
    },
    {
      path: '/404',
      name: '404',
      meta: {
        title: 'Not found',
      },
      component: () => import('../views/404.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      redirect: { name: '404', params: {} }
    },
  ]
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || '教务管理系统'
  const userInfo = userInfoStore();
  // console.log('userInfo.role', userInfo.role)
  // console.log('userInfo.keys', userInfo.keys)
  // console.log('userInfo.username', userInfo.username)
  if (!userInfo.role && to.path !== '/login') {
    next('/login');
  } else if (to.meta.roles && !to.meta.roles.includes(userInfo.role)) {
    // 权限不足
    next('/403');
  } else {
    next();
  }
});

export default router
