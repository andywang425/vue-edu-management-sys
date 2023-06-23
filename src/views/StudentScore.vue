<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <div class="el-space-wrap">
                    <el-space class="el-space-center" wrap>
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
                        <el-text size="large">课程ID</el-text>
                        <el-input v-model="form.cid" placeholder="留空表示任意课程ID" class="handle-input input-margin"></el-input>
                    </el-space>
                </div>
                <div class="search-btn-wrap">
                    <el-button type="primary" size="large" :icon="Search" @click="getData">查询</el-button>
                </div>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                <el-table-column prop="cid" label="课程ID"></el-table-column>
                <el-table-column prop="sname" label="学生姓名"></el-table-column>
                <el-table-column prop="course_name" label="课名"></el-table-column>
                <el-table-column prop="year" label="授课学年"></el-table-column>
                <el-table-column prop="semester" label="授课学期"></el-table-column>
                <el-table-column prop="score" label="成绩"></el-table-column>
                <el-table-column prop="gp" label="绩点"></el-table-column>
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
    const res = await API.getStudentScore(form);
    route_jump(router, res);
    if (res.code === 0) {
        ElMessage.success('查询成功');
        convertDataList(res.data)
        tableData.value = res.data;
    } else if (res.code === 1) {
        ElMessage.error(res.msg);
    } else {
        ElMessage.error('查询失败');
    }
};
// 搜索条件输入数据
let form = reactive({
    year: 'any',
    semester: 'any',
    cid: ''
});
// 校验输入是否合法
const validateInput = (cid) => {
    if (cid && getByteLength(cid) > 15) {
        ElMessage.warning('课程ID长度不能超过15');
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

.el-space-center {
    display: flex;
    align-items: center;
    justify-content: center;
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
