<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <div class="el-space-wrap">
                    <el-space wrap>
                        <el-text size="large">课号&emsp;&emsp;&emsp;</el-text>
                        <el-input v-model="form.cno" placeholder="留空表示任意课号" class="handle-input input-margin"></el-input>
                        <el-text size="large">课名&emsp;&emsp;&emsp;</el-text>
                        <el-input v-model="form.cname" placeholder="留空表示任意课名" class="handle-input input-margin"></el-input>
                        <el-text size="large">学分</el-text>
                        <el-input v-model="form.credit" placeholder="留空表示任意学分" class="handle-input input-margin"></el-input>
                        <el-text size="large">学时</el-text>
                        <el-input v-model="form.chour" placeholder="留空表示任意学时" class="handle-input input-margin"></el-input>
                    </el-space>
                </div>
                <div class="el-space-wrap">
                    <el-space wrap>
                        <el-text size="large">先行课课号</el-text>
                        <el-input v-model="form.pre_cno" placeholder="留空表示任意先行课课号"
                            class="handle-input input-margin"></el-input>

                        <el-text size="large">先行课课名</el-text>
                        <el-input v-model="form.pre_cname" placeholder="留空表示任意先行课课名"
                            class="handle-input input-margin"></el-input>
                    </el-space>
                </div>
                <div class="search-btn-wrap">
                    <el-button type="primary" size="large" :icon="Search" @click="getData">查询</el-button>
                </div>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                <el-table-column prop="cno" label="课号" width="120" align="center"></el-table-column>
                <el-table-column prop="cname" label="课名"></el-table-column>
                <el-table-column prop="credit" label="学分" width="80" align="center"></el-table-column>
                <el-table-column prop="chour" label="学时" width="80" align="center"></el-table-column>
                <el-table-column prop="pre_cno" label="先行课课号" width="120" align="center"></el-table-column>
                <el-table-column prop="pre_cname" label="先行课课名"></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { Search } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
import { getByteLength, isNaturalNumber, route_jump } from '../utils/common'
import API from '../utils/api'

const router = useRouter();
// 原始表格数据
const tableData = ref([]);
// 请求数据
const getData = async () => {
    if (!validateInput(form.cno, form.cname, form.credit, form.chour, form.pre_cno, form.pre_cname))
        return;
    const res = await API.getAllCourseInfoV2(form);
    route_jump(router, res);
    if (res.code === 0) {
        ElMessage.success('查询成功');
        tableData.value = res.data;
    } else {
        ElMessage.error('查询失败');
    }
};
// 搜索条件输入数据
let form = reactive({
    cno: '',
    cname: '',
    credit: '',
    chour: '',
    pre_cno: '',
    pre_cname: ''
});
// 校验输入是否合法
const validateInput = (course_no, course_name, credit, hour, pre_course_no, pre_course_name) => {
    if (course_no && getByteLength(course_no) > 10) {
        ElMessage.warning('课号长度不能超过10');
        return false;
    }
    if (course_name && getByteLength(course_name) > 20) {
        ElMessage.warning('课名长度不能超过20');
        return false;
    }
    if (credit && !isNaturalNumber(credit)) {
        ElMessage.warning('学分不合法');
        return false;
    }
    if (hour && !isNaturalNumber(hour)) {
        ElMessage.warning('学时不合法');
        return false;
    }
    if (pre_course_no && getByteLength(pre_course_no) > 10) {
        ElMessage.warning('先行课课号长度不能超过10');
        return false;
    }
    if (pre_course_name && getByteLength(pre_course_name) > 20) {
        ElMessage.warning('先行课课名长度不能超过20');
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
    width: 200px;
}

.handle-input {
    width: 200px;
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
