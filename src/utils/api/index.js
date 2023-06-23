import request from "../request";

class API {
    static async check() {
        return request.get('/check');
    }
    static login(requestData) {
        return request.post('/login', requestData);
    }
    static logout() {
        return request.post('/logout');
    }
    static modPassword(requestData) {
        return request.post('/mod_password', requestData);
    }
    static getAllCollegeInfo() {
        return request.get('/college/all');
    }
    static createCollege(requestData) {
        return request.post('/college/create', requestData);
    }
    static deleteCollege(requestData) {
        return request.post('/college/delete', requestData);
    }
    static modifyCollege(requestData) {
        return request.post('/college/modify', requestData);
    }
    static getAllMajorInfo() {
        return request.get('/major/all');
    }
    static createMajor(requestData) {
        return request.post('/major/create', requestData);
    }
    static deleteMajor(requestData) {
        return request.post('/major/delete', requestData);
    }
    static modifyMajor(requestData) {
        return request.post('/major/modify', requestData);
    }
    static getCollegeName(requestData) {
        return request.get('/college/name', requestData);
    }
    static getAllClassInfo() {
        return request.get('/class/all');
    }
    static createClass(requestData) {
        return request.post('/class/create', requestData);
    }
    static getMajorName(requestData) {
        return request.get('/major/name', requestData);
    }
    static modifyClass(requestData) {
        return request.post('/class/modify', requestData);
    }
    static deleteClass(requestData) {
        return request.post('/class/delete', requestData);
    }
    static getAllCurrentStudentInfo() {
        return request.get('/student_current/all');
    }
    static createStudent(requestData) {
        return request.post('/student_current/create', requestData);
    }
    static getOneStudentInfo(requestData) {
        return request.get('/student_current/one', requestData);
    }
    static modifyStudent(requestData) {
        return request.post('/student_current/modify', requestData);
    }
    static deleteStudent(requestData) {
        return request.post('/student_current/delete', requestData);
    }
    static getAllTeacherInfo() {
        return request.get('/teacher/all');
    }
    static createTeacher(requestData) {
        return request.post('/teacher/create', requestData);
    }
    static modifyTeacher(requestData) {
        return request.post('/teacher/modify', requestData);
    }
    static deleteTeacher(requestData) {
        return request.post('/teacher/delete', requestData);
    }
    static getAllCourseInfo() {
        return request.get('/course/all');
    }
    static createCourse(requestData) {
        return request.post('/course/create', requestData);
    }
    static getOneCourseInfo(requestData) {
        return request.get('/course/name', requestData);
    }
    static modifyCourse(requestData) {
        return request.post('/course/modify', requestData);
    }
    static deleteCourse(requestData) {
        return request.post('/course/delete', requestData);
    }
    static uploadClasses(requestData) {
        return request.post('/class/upload', requestData);
    }
    static uploadStudents(requestData) {
        return request.post('/student_current/upload', requestData);
    }
    static getAllCoursePlanInfo() {
        return request.get('/course_plan/all');
    }
    static createCoursePlan(requestData) {
        return request.post('/course_plan/create', requestData);
    }
    static getOneCoursePlan(requestData) {
        return request.get('/course_plan/one', requestData);
    }
    static modifyCoursePlan(requestData) {
        return request.post('/course_plan/modify', requestData);
    }
    static deleteCoursePlan(requestData) {
        return request.post('/course_plan/delete', requestData);
    }
    static getAllTeachInfo() {
        return request.get('/teach/all');
    }
    static createTeachInfo(requestData) {
        return request.post('/teach/create', requestData);
    }
    static getOneTeachInfo(requestData) {
        return request.get('/teach/one', requestData);
    }
    static modifyTeachInfo(requestData) {
        return request.post('/teach/modify', requestData);
    }
    static deleteTeachInfo(requestData) {
        return request.post('/teach/delete', requestData);
    }
    static graduateStudent(requestData) {
        return request.post('/student_current/graduate', requestData);
    }
    static getAllStudentInfo(requestData) {
        return request.post('/student/all', requestData);
    }
    static getAllCollegeName() {
        return request.get('/college/names/all');
    }
    static getAllMajorName(requestData) {
        return request.get('/college/major/name/all', requestData);
    }
    static getAllTeacherInfoV2(requestData) {
        return request.post('/teacher/v2/all', requestData);
    }
    static getAllCourseInfoV2(requestData) {
        return request.post('/course/v2/all', requestData);
    }
    static getAllTeachInfoV2(requestData) {
        return request.post('/teach/v2/all', requestData);
    }
    static getAllElectiveInfo(requestData) {
        return request.post('/elective/all', requestData);
    }
    static studentElectiveStatement(requestData) {
        return request.get('/statement/student_elective', requestData)
    }
    static teacherTeachStatement(requestData) {
        return request.get('/statement/teacher_teach', requestData)
    }
    static classGPAStatement(requestData) {
        return request.get('/statement/class_gpa', requestData)
    }
    static teacherTitleStatement() {
        return request.get('/statement/teacher_title')
    }
    static collegeCourseStatement(requestData) {
        return request.get('/statement/college_course', requestData)
    }
    static teacherCourseStatement(requestData) {
        return request.get('/statement/teacher_course', requestData)
    }
    static getStudentCoursePlan(requestData) {
        return request.get('/student/home/course_plan', requestData)
    }
    static electiveCourse(requestData) {
        return request.post('/student/home/elective_course', requestData);
    }
    static getMyCourses(requestData) {
        return request.get('/student/home/my_courses', requestData)
    }
    static uploadStudentScores(requestData) {
        return request.post('/student_score/upload', requestData);
    }
    static getStudentScore(requestData) {
        return request.get('/teacher/home/student_score', requestData);
    }
    static getStudentElectiveInfo(requestData) {
        return request.get('/teacher/home/student_elective_info', requestData);
    }
}

export default API;

