<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <div class="el-space-wrap">
                    <el-space class="el-space-center" wrap>
                        <el-text size="large">学号</el-text>
                        <el-input v-model="form.sno" placeholder="学生学号" class="handle-input input-margin"></el-input>
                    </el-space>
                </div>
                <div class="search-btn-wrap">
                    <el-button type="primary" size="large" :icon="Search" @click="getData">查询</el-button>
                </div>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                <el-table-column prop="cid" label="课程ID"></el-table-column>
                <el-table-column prop="course_name" label="课名"></el-table-column>
                <el-table-column prop="year" label="学年"></el-table-column>
                <el-table-column prop="semester" label="学期"></el-table-column>
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
// 请求数据
const getData = async () => {
    if (!validateInput(form.sno))
        return;
    const res = await API.getStudentElectiveInfo(form);
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
    sno: ''
});
// 校验输入是否合法
const validateInput = (sno) => {
    if (!sno) {
        ElMessage.warning('请填写学生学号');
        return false;
    }
    if (getByteLength(sno) != 8) {
        ElMessage.warning('学生学号长度必须为8');
        return false;
    }
    return true;
};
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
