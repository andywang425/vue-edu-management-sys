<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <div class="el-space-wrap">
                    <el-space wrap>
                        <el-text size="large">学年</el-text>
                        <el-select v-model="form.year" placeholder="学年" class="handle-select input-margin">
                            <el-option key="-1" label="任意" value="any"></el-option>
                            <el-option v-for="(item, index) in years_list" :key="index" :label="item.label"
                                :value="item.value"></el-option>
                        </el-select>
                        <el-text size="large">学期</el-text>
                        <el-select v-model="form.semester" placeholder="学期" class="handle-select input-margin">
                            <el-option key="-1" label="任意" value="any"></el-option>
                            <el-option key="1" label="第一学期" value="1"></el-option>
                            <el-option key="2" label="第二学期" value="2"></el-option>
                        </el-select>
                    </el-space>
                </div>
                <div class="search-btn-wrap">
                    <el-button type="primary" size="large" :icon="Search" @click="getData">查询</el-button>
                </div>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                <el-table-column prop="year" label="学年"></el-table-column>
                <el-table-column prop="semester" label="学期"></el-table-column>
                <el-table-column prop="cid" label="课程ID"></el-table-column>
                <el-table-column prop="cname" label="课名"></el-table-column>
                <el-table-column prop="credit" label="获得学分"></el-table-column>
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
import { route_jump, convertDataList } from '../utils/common'
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
    const res = await API.getMyCourses(form);
    route_jump(router, res);
    if (res.code === 0) {
        ElMessage.success('查询成功');
        convertDataList(res.data);
        tableData.value = res.data;
    } else {
        ElMessage.error('查询失败');
    }
};
// 搜索条件输入数据
let form = reactive({
    year: 'any',
    semester: "any"
});
</script>

<style scoped>
.credit-text-wrap {
    margin-bottom: 20px;
}

.search-btn-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
}

.el-space-wrap {
    margin-bottom: 10px;
    display: flex;
    justify-content: center;
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
