<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <div class="el-space-wrap">
                    <el-space wrap>
                        <el-text size="large">学院</el-text>
                        <el-select v-model="form.college_name" placeholder="学院"
                            class="handle-select input-margin">
                            <el-option v-for="(item, index) in college_options" :key="index" :label="item" :value="item">
                            </el-option>
                        </el-select>
                    </el-space>
                </div>
                <div class="search-btn-wrap">
                    <el-button type="primary" size="large" :icon="Search" @click="getData">查询</el-button>
                    <el-button type="success" size="large" :disabled="exportDataDisable" :icon="Download"
                        @click="exportData">导出Excel</el-button>
                </div>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                <el-table-column prop="cname" label="课名"></el-table-column>
                <el-table-column prop="chour" label="学时"></el-table-column>
                <el-table-column prop="pre_cname" label="先行课课名"></el-table-column>
                <el-table-column prop="pre_chour" label="先行课学时"></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { Search, Download } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
import { route_jump, objectList2Array } from '../utils/common'
import * as XLSX from 'xlsx';
import API from '../utils/api'

const router = useRouter();
// 原始表格数据
const tableData = ref([]);
// 学院选项
const college_options = ref([]);
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
// 请求数据
const getData = async () => {
    const res = await API.collegeCourseStatement(form);
    route_jump(router, res);
    if (res.code === 0) {
        if (res.data.length) {
            exportDataDisable.value = false;
        } else {
            exportDataDisable.value = true;
        }
        ElMessage.success('查询成功');
        tableData.value = res.data;
    } else {
        ElMessage.error('查询失败');
    }
};
// 搜索条件输入数据
let form = reactive({
    college_name: '计算机科学与技术学院'
});
// 是否禁止导出
const exportDataDisable = ref(true);
// 导出查询结果为Excel
const exportData = () => {
    const header = ['课名', '学时', '先行课课名', '先行课学时'];
    const properties = ['cname', 'chour', 'pre_cname', 'pre_chour'];
    // 把tableData转换成aoa
    const list = objectList2Array(tableData.value, properties);
    // 添加表头
    list.unshift(header);
    // 导出
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(list);
    XLSX.utils.book_append_sheet(workbook, worksheet);
    XLSX.writeFile(workbook, `${form.college_name}课程报表.xlsx`);
};
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
