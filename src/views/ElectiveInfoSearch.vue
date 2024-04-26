<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <div class="el-space-wrap">
                    <el-space wrap>
                        <el-text size="large">课程ID</el-text>
                        <el-input v-model="form.cid" placeholder="留空表示任意课程ID" class="handle-input input-margin"></el-input>
                        <el-text size="large">学生姓名</el-text>
                        <el-input v-model="form.sname" placeholder="留空表示任意学生姓名"
                            class="handle-input input-margin"></el-input>
                        <el-text size="large">课名</el-text>
                        <el-input v-model="form.course_name" placeholder="留空表示任意课名"
                            class="handle-input input-margin"></el-input>
                        <el-text size="large">学院</el-text>
                        <el-select v-model="form.college_name" placeholder="学院" @change="collegeChangeHandler"
                            class="handle-select input-margin">
                            <el-option key="-1" label="任意" value="any"></el-option>
                            <el-option v-for="(item, index) in college_options" :key="index" :label="item" :value="item">
                            </el-option>
                        </el-select>
                        <el-text size="large">专业</el-text>
                        <el-select v-model="form.mname" placeholder="专业" class="handle-select input-margin">
                            <el-option key="-1" label="任意" value="any"></el-option>
                            <el-option v-for="(item, index) in major_options" :key="index" :label="item" :value="item">
                            </el-option>
                        </el-select>
                    </el-space>
                </div>
                <div class="el-space-wrap">
                    <el-space wrap>
                        <el-text size="large">学年&emsp;</el-text>
                        <el-select v-model="form.year" placeholder="学年" class="handle-select input-margin">
                            <el-option key="-1" label="任意" value="any"></el-option>
                            <el-option v-for="(item, index) in years_list" :key="index" :label="item.label"
                                :value="item.value"></el-option>
                        </el-select>
                        <el-text size="large">学期&emsp;&emsp;</el-text>
                        <el-select v-model="form.semester" placeholder="学期" class="handle-select input-margin">
                            <el-option key="-1" label="任意" value="any"></el-option>
                            <el-option key="1" label="第一学期" value="1"></el-option>
                            <el-option key="2" label="第二学期" value="2"></el-option>
                        </el-select>
                        <el-text size="large">成绩</el-text>
                        <el-input v-model="form.score" placeholder="留空表示任意成绩" class="handle-input input-margin"></el-input>
                        <el-text size="large">绩点</el-text>
                        <el-input v-model="form.gp" placeholder="留空表示任意绩点" class="handle-input input-margin"></el-input>
                        <el-text size="large">学生状态</el-text>
                        <el-select v-model="form.type" placeholder="学生状态" style="width: 150px;">
                            <el-option key="-1" label="任意" value="any"></el-option>
                            <el-option key="1" label="在籍" value="在籍"></el-option>
                            <el-option key="2" label="毕业" value="毕业"></el-option>
                        </el-select>
                    </el-space>
                </div>
                <div class="search-btn-wrap">
                    <el-button type="primary" size="large" :icon="Search" @click="getData">查询</el-button>
                </div>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                <el-table-column prop="cid" label="课程ID" width="150" align="center"></el-table-column>
                <el-table-column prop="sname" label="学生姓名" width="150"></el-table-column>
                <el-table-column prop="course_name" label="课名"></el-table-column>
                <el-table-column prop="college_name" label="所属学院"></el-table-column>
                <el-table-column prop="mname" label="所属专业"></el-table-column>
                <el-table-column prop="year" label="授课学年" width="100" align="center"></el-table-column>
                <el-table-column prop="semester" label="授课学期" width="120" align="center"></el-table-column>
                <el-table-column prop="score" label="成绩" width="80" align="center"></el-table-column>
                <el-table-column prop="gp" label="绩点" width="80" align="center"></el-table-column>
                <el-table-column prop="type" label="学生状态" width="100" align="center"></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { Search } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
import { getByteLength, route_jump, convertDataList } from '../utils/common'
import API from '../utils/api'

const router = useRouter();
// 原始表格数据
const tableData = ref([]);
// 学院选项
const college_options = ref([]);
// 专业选项
const major_options = ref([]);
// 获取学院名称列表
const getCollegeNames = async () => {
    const res = await API.getAllCollegeName();
    route_jump(router, res);
    if (res.code === 0) {
        college_options.value = res.data;
    } else {
        ElMessage.error('获取学院名称列表失败');
    }
};
getCollegeNames();
// 获取专业名称列表
const collegeChangeHandler = async (cname) => {
    form.mname = 'any';
    const res = await API.getAllMajorName({ cname: cname });
    route_jump(router, res);
    if (res.code === 0) {
        major_options.value = res.data;
    } else {
        ElMessage.error('获取专业名称列表失败');
    }
};
// 学年数组，包含过去9年，当前年和未来2年
const years_list = (function () {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 9; i <= currentYear + 2; i++) {
        years.push({ value: i, label: `${i}-${i + 1}` });
    }
    return years;
})();
// 请求数据
const getData = async () => {
    if (!validateInput(form.cid, form.course_name, form.tname))
        return;
    const res = await API.getAllElectiveInfo(form);
    route_jump(router, res);
    if (res.code === 0) {
        ElMessage.success('查询成功');
        convertDataList(res.data)
        tableData.value = res.data;
    } else {
        ElMessage.error('查询失败');
    }
};
// 搜索条件输入数据
let form = reactive({
    cid: '',
    sname: '',
    course_name: '',
    college_name: 'any',
    mname: 'any',
    tname: '',
    year: 'any',
    semester: 'any',
    score: '',
    gp: '',
    type: 'any'
});
// 校验输入是否合法
const validateInput = (cid, course_name, tname) => {
    if (cid && getByteLength(cid) > 10) {
        ElMessage.warning('课程ID长度不能超过15');
        return false;
    }
    if (course_name && getByteLength(course_name) > 20) {
        ElMessage.warning('课名长度不能超过20');
        return false;
    }
    if (tname && getByteLength(tname) > 20) {
        ElMessage.warning('教师姓名长度不能超过20');
        return false;
    }
    return true;
}
</script>

<style scoped>
.search-btn-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
}

.el-space-wrap {
    margin-bottom: 10px;
}

.input-margin {
    margin-inline-end: 20px;
}

.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 190px;
}

.handle-input {
    width: 190px;
}

.table {
    width: 100%;
    font-size: 14px;
}

.red {
    color: #F56C6C;
}

.mr10 {
    margin-right: 10px;
}

.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>
